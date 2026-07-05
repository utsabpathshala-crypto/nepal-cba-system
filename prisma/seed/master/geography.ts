/**
 * prisma/seed/master/geography.ts
 *
 * Seeds Nepal's official geography master data:
 *   MunicipalityType -> Province -> District -> LocalLevel
 *
 * Source datasets (raw government/NPC exports):
 *   - ../data/provinces.json          { province_id, name, nepali_name }
 *   - ../data/districts.json          { district_id, name, nepali_name, province_id }
 *   - ../data/municipality-types.json { local_level_type_id, name, nepali_name }
 *   - ../data/local-levels.json       { municipality_id, name, nepali_name, district_id, local_level_type_id }
 *
 * Mapping notes (based strictly on the uploaded schema.prisma — nothing renamed/redesigned):
 *   - Every master model exposes a unique `governmentId` (Int) column, which is the
 *     natural key we upsert against. This is exactly what the field's schema comment
 *     says it's for: "cross-reference against government/NPC master datasets during
 *     seeding and sync".
 *   - None of the raw JSON files carry a `code` string field. The schema requires a
 *     unique, non-null `code` on every one of these models (and District/LocalLevel
 *     additionally scope it as @@unique([parentId, code])). Since no official code is
 *     supplied in the source data, we deterministically derive one from the government
 *     id (e.g. `DIST-4`, `LL-753`). This is stable across re-runs, so upserts stay
 *     idempotent, and it never collides because governmentId is unique per model.
 *   - `totalWards` is optional (Int?) on LocalLevel. The provided local-levels.json
 *     does not include ward counts, so it is safely left null. If a future dataset
 *     adds a `total_wards` field, it is picked up automatically (see LocalLevelJson).
 *   - `nameNepali` is optional on every model; missing/empty values are coerced to null.
 *   - `displayOrder` is derived from each record's position in its source array,
 *     preserving the government dataset's natural ordering.
 *   - Foreign keys (District.provinceId, LocalLevel.districtId, LocalLevel.municipalityTypeId)
 *     are Prisma-generated UUIDs, never the raw government ids. We build in-memory
 *     lookup maps (governmentId -> uuid) as parents are upserted, and use those maps
 *     to resolve child foreign keys.
 */

import { PrismaClient } from "../../../app/generated/prisma/client";

import provincesData from '../data/provinces.json';
import districtsData from '../data/districts.json';
import municipalityTypesData from '../data/municipality-types.json';
import localLevelsData from '../data/local-levels.json';

//////////////////////////////////////////////////////////////////////////////
// Raw source dataset shapes
//////////////////////////////////////////////////////////////////////////////

interface ProvinceJson {
  province_id: number;
  name: string;
  nepali_name?: string | null;
}

interface DistrictJson {
  district_id: number;
  name: string;
  nepali_name?: string | null;
  province_id: number;
}

interface MunicipalityTypeJson {
  local_level_type_id: number;
  name: string;
  nepali_name?: string | null;
}

interface LocalLevelJson {
  municipality_id: number;
  name: string;
  nepali_name?: string | null;
  district_id: number;
  local_level_type_id: number;
  // Not present in the currently uploaded dataset, but supported if a future
  // export adds it.
  total_wards?: number | null;
}

//////////////////////////////////////////////////////////////////////////////
// Helpers
//////////////////////////////////////////////////////////////////////////////

/** Coerces a possibly-missing/blank Nepali name into a clean `string | null`. */
function normalizeNepaliName(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Deterministic, stable, human-readable code derived from a government id. */
function deriveCode(prefix: string, governmentId: number): string {
  return `${prefix}-${governmentId}`;
}

//////////////////////////////////////////////////////////////////////////////
// Seed function
//////////////////////////////////////////////////////////////////////////////

/**
 * Seeds MunicipalityType, Province, District and LocalLevel master data.
 * Fully idempotent: every write is an `upsert` keyed on the model's unique
 * `governmentId`, so re-running this function never creates duplicates and
 * always converges existing rows toward the source dataset.
 *
 * @param prisma A PrismaClient instance (or an interactive-transaction client)
 *               to run the seed against. Passed in explicitly so this module
 *               stays reusable from prisma/seed/index.ts, tests, or one-off scripts.
 */
export async function seedGeography(prisma: PrismaClient): Promise<void> {
  console.log('[seed:geography] Starting geography master data seed...');

  const municipalityTypes = municipalityTypesData as MunicipalityTypeJson[];
  const provinces = provincesData as ProvinceJson[];
  const districts = districtsData as DistrictJson[];
  const localLevels = localLevelsData as LocalLevelJson[];

  if (!Array.isArray(municipalityTypes) || municipalityTypes.length === 0) {
    throw new Error('[seed:geography] municipality-types.json is empty or invalid.');
  }
  if (!Array.isArray(provinces) || provinces.length === 0) {
    throw new Error('[seed:geography] provinces.json is empty or invalid.');
  }
  if (!Array.isArray(districts) || districts.length === 0) {
    throw new Error('[seed:geography] districts.json is empty or invalid.');
  }
  if (!Array.isArray(localLevels) || localLevels.length === 0) {
    throw new Error('[seed:geography] local-levels.json is empty or invalid.');
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        //////////////////////////////////////////////////////////////////
        // 1. MunicipalityType
        //////////////////////////////////////////////////////////////////
        const municipalityTypeIdByGovernmentId = new Map<number, string>();

        for (let index = 0; index < municipalityTypes.length; index++) {
          const row = municipalityTypes[index];

          if (row.local_level_type_id == null || !row.name) {
            throw new Error(
              `[seed:geography] Invalid municipality type row at index ${index}: ${JSON.stringify(row)}`,
            );
          }

          const record = await tx.municipalityType.upsert({
            where: { governmentId: row.local_level_type_id },
            update: {
              code: deriveCode('MUNTYPE', row.local_level_type_id),
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
            create: {
              code: deriveCode('MUNTYPE', row.local_level_type_id),
              governmentId: row.local_level_type_id,
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
          });

          municipalityTypeIdByGovernmentId.set(row.local_level_type_id, record.id);
        }

        console.log(
          `[seed:geography] Upserted ${municipalityTypeIdByGovernmentId.size} municipality type(s).`,
        );

        //////////////////////////////////////////////////////////////////
        // 2. Province
        //////////////////////////////////////////////////////////////////
        const provinceIdByGovernmentId = new Map<number, string>();

        for (let index = 0; index < provinces.length; index++) {
          const row = provinces[index];

          if (row.province_id == null || !row.name) {
            throw new Error(
              `[seed:geography] Invalid province row at index ${index}: ${JSON.stringify(row)}`,
            );
          }

          const record = await tx.province.upsert({
            where: { governmentId: row.province_id },
            update: {
              code: deriveCode('PROV', row.province_id),
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
            create: {
              code: deriveCode('PROV', row.province_id),
              governmentId: row.province_id,
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
          });

          provinceIdByGovernmentId.set(row.province_id, record.id);
        }

        console.log(`[seed:geography] Upserted ${provinceIdByGovernmentId.size} province(s).`);

        //////////////////////////////////////////////////////////////////
        // 3. District (depends on Province)
        //////////////////////////////////////////////////////////////////
        const districtIdByGovernmentId = new Map<number, string>();

        for (let index = 0; index < districts.length; index++) {
          const row = districts[index];

          if (row.district_id == null || !row.name || row.province_id == null) {
            throw new Error(
              `[seed:geography] Invalid district row at index ${index}: ${JSON.stringify(row)}`,
            );
          }

          const provinceId = provinceIdByGovernmentId.get(row.province_id);
          if (!provinceId) {
            throw new Error(
              `[seed:geography] District "${row.name}" (district_id: ${row.district_id}) references unknown province_id ${row.province_id}. Ensure provinces.json was seeded first and contains this province.`,
            );
          }

          const record = await tx.district.upsert({
            where: { governmentId: row.district_id },
            update: {
              provinceId,
              code: deriveCode('DIST', row.district_id),
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
            create: {
              provinceId,
              code: deriveCode('DIST', row.district_id),
              governmentId: row.district_id,
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
          });

          districtIdByGovernmentId.set(row.district_id, record.id);
        }

        console.log(`[seed:geography] Upserted ${districtIdByGovernmentId.size} district(s).`);

        //////////////////////////////////////////////////////////////////
        // 4. LocalLevel (depends on District + MunicipalityType)
        //////////////////////////////////////////////////////////////////
        let localLevelCount = 0;

        for (let index = 0; index < localLevels.length; index++) {
          const row = localLevels[index];

          if (
            row.municipality_id == null ||
            !row.name ||
            row.district_id == null ||
            row.local_level_type_id == null
          ) {
            throw new Error(
              `[seed:geography] Invalid local level row at index ${index}: ${JSON.stringify(row)}`,
            );
          }

          const districtId = districtIdByGovernmentId.get(row.district_id);
          if (!districtId) {
            throw new Error(
              `[seed:geography] Local level "${row.name}" (municipality_id: ${row.municipality_id}) references unknown district_id ${row.district_id}.`,
            );
          }

          const municipalityTypeId = municipalityTypeIdByGovernmentId.get(row.local_level_type_id);
          if (!municipalityTypeId) {
            throw new Error(
              `[seed:geography] Local level "${row.name}" (municipality_id: ${row.municipality_id}) references unknown local_level_type_id ${row.local_level_type_id}.`,
            );
          }

          const totalWards =
            typeof row.total_wards === 'number' && Number.isFinite(row.total_wards)
              ? row.total_wards
              : null;

          await tx.localLevel.upsert({
            where: { governmentId: row.municipality_id },
            update: {
              districtId,
              municipalityTypeId,
              code: deriveCode('LL', row.municipality_id),
              totalWards,
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
            create: {
              districtId,
              municipalityTypeId,
              code: deriveCode('LL', row.municipality_id),
              governmentId: row.municipality_id,
              totalWards,
              nameEnglish: row.name,
              nameNepali: normalizeNepaliName(row.nepali_name),
              displayOrder: index,
              isActive: true,
            },
          });

          localLevelCount++;
        }

        console.log(`[seed:geography] Upserted ${localLevelCount} local level(s).`);
      },
      {
        // The full dataset (7 provinces, 77 districts, 4 municipality types,
        // 753+ local levels) is upserted row-by-row inside one interactive
        // transaction so the whole geography tree is seeded atomically.
        // The default 5s transaction timeout is far too short for that many
        // sequential writes, so it is extended generously here.
        maxWait: 15_000,
        timeout: 300_000,
      },
    );

    console.log('[seed:geography] Geography master data seeded successfully.');
  } catch (error) {
    console.error('[seed:geography] Failed to seed geography master data:', error);
    throw error;
  }
}
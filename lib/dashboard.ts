import { prisma } from "@/lib/prisma";

// NOTE: adjust this import if your actual Prisma client singleton lives at a
// different path (e.g. "@/lib/prisma") — it must resolve to the file
// that exports `export const prisma = ...` (the one you already have).

export interface DashboardStats {
  municipalityTypes: number;
  provinces: number;
  districts: number;
  localLevels: number;
  schools: number;
  campuses: number;
  students: number;
  teachers: number;
}

export interface DatabaseStatus {
  connected: boolean;
  migrationApplied: boolean;
  geographySeedCompleted: boolean;
  totalRecords: number;
}

export interface DashboardData {
  stats: DashboardStats;
  databaseStatus: DatabaseStatus;
}

const EMPTY_STATS: DashboardStats = {
  municipalityTypes: 0,
  provinces: 0,
  districts: 0,
  localLevels: 0,
  schools: 0,
  campuses: 0,
  students: 0,
  teachers: 0,
};

/**
 * Counts rows in Prisma's own `_prisma_migrations` table that finished
 * successfully and were never rolled back. This is a real check against
 * migration history, not an assumption — if migrate hasn't been run this
 * returns 0 and the dashboard reports it truthfully.
 */
async function countAppliedMigrations(): Promise<number> {
  const rows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count
    FROM "_prisma_migrations"
    WHERE "finished_at" IS NOT NULL AND "rolled_back_at" IS NULL
  `;
  return Number(rows[0]?.count ?? 0);
}

/**
 * Single entry point for every number shown on the dashboard. Every value is
 * a live Prisma count/query — nothing here is hardcoded. If the database is
 * unreachable, we degrade to a "Disconnected" status card instead of
 * crashing the whole page.
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [
      municipalityTypes,
      provinces,
      districts,
      localLevels,
      schools,
      campuses,
      students,
      teachers,
      appliedMigrations,
    ] = await Promise.all([
      prisma.municipalityType.count(),
      prisma.province.count(),
      prisma.district.count(),
      prisma.localLevel.count(),
      // Schools/Campuses/Students use soft delete (deletedAt) — exclude
      // soft-deleted rows so the count reflects records actually in use.
      prisma.school.count({ where: { deletedAt: null } }),
      prisma.campus.count({ where: { deletedAt: null } }),
      prisma.student.count({ where: { deletedAt: null } }),
      // Teacher has its own isActive flag; also exclude teachers whose
      // underlying Employee record has been soft-deleted.
      prisma.teacher.count({
        where: { isActive: true, employee: { deletedAt: null } },
      }),
      countAppliedMigrations(),
    ]);

    const stats: DashboardStats = {
      municipalityTypes,
      provinces,
      districts,
      localLevels,
      schools,
      campuses,
      students,
      teachers,
    };

    const totalRecords = Object.values(stats).reduce((sum, n) => sum + n, 0);

    const databaseStatus: DatabaseStatus = {
      connected: true,
      migrationApplied: appliedMigrations > 0,
      geographySeedCompleted:
        stats.municipalityTypes > 0 &&
        stats.provinces > 0 &&
        stats.districts > 0 &&
        stats.localLevels > 0,
      totalRecords,
    };

    return { stats, databaseStatus };
  } catch (error) {
    console.error("[dashboard] failed to load stats from the database", error);
    return {
      stats: EMPTY_STATS,
      databaseStatus: {
        connected: false,
        migrationApplied: false,
        geographySeedCompleted: false,
        totalRecords: 0,
      },
    };
  }
}

/**
 * prisma/seed/index.ts
 *
 * Main seed entrypoint.
 *
 * Order of execution matters here: geography (Province -> District ->
 * MunicipalityType -> LocalLevel) is foundational reference data that other
 * master-data and transactional seed modules (schools, staff, students, etc.)
 * depend on via foreign keys, so it always runs first.
 *
 * Additional seed modules should be added below, in the correct dependency
 * order, following the same `import { seedX } from './...'` + `await seedX(prisma)`
 * pattern already established for `seedGeography`.
 */
import "dotenv/config";

import { PrismaClient } from "../../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedGeography } from "./master/geography";

console.log("DATABASE_URL =", process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});
async function main(): Promise<void> {
  console.log('========================================');
  console.log(' Starting database seed');
  console.log('========================================');

  // 1. Geography master data — must run first; every downstream model that
  //    stores a provinceId/districtId/localLevelId (School, Campus, Student,
  //    Guardian, Employee) depends on these rows already existing.
  await seedGeography(prisma);

  // 2. Additional seed modules go here, in dependency order, e.g.:
  //
  //    import { seedLookupTables } from './master/lookup-tables';
  //    import { seedSchools } from './foundation/schools';
  //    import { seedCurriculum } from './academic/curriculum';
  //    ...
  //
  //    await seedLookupTables(prisma);
  //    await seedSchools(prisma);
  //    await seedCurriculum(prisma);

  console.log('========================================');
  console.log(' Database seed completed successfully');
  console.log('========================================');
}

main()
  .catch((error) => {
    console.error('----------------------------------------');
    console.error(' Database seed failed');
    console.error('----------------------------------------');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
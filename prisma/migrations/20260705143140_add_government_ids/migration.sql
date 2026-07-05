/*
  Warnings:

  - A unique constraint covering the columns `[governmentId]` on the table `District` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[governmentId]` on the table `LocalLevel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[governmentId]` on the table `MunicipalityType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[governmentId]` on the table `Province` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `governmentId` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `governmentId` to the `LocalLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `governmentId` to the `MunicipalityType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `governmentId` to the `Province` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "District" ADD COLUMN     "governmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LocalLevel" ADD COLUMN     "governmentId" INTEGER NOT NULL,
ADD COLUMN     "totalWards" INTEGER;

-- AlterTable
ALTER TABLE "MunicipalityType" ADD COLUMN     "governmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Province" ADD COLUMN     "governmentId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "District_governmentId_key" ON "District"("governmentId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalLevel_governmentId_key" ON "LocalLevel"("governmentId");

-- CreateIndex
CREATE UNIQUE INDEX "MunicipalityType_governmentId_key" ON "MunicipalityType"("governmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Province_governmentId_key" ON "Province"("governmentId");

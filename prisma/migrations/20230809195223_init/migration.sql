/*
  Warnings:

  - Changed the type of `result` on the `Settings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "result",
ADD COLUMN     "result" INTEGER NOT NULL;

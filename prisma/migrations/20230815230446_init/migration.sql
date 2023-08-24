/*
  Warnings:

  - The `isSubscribed` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expiryDate" TIMESTAMP(3),
DROP COLUMN "isSubscribed",
ADD COLUMN     "isSubscribed" INTEGER NOT NULL DEFAULT 0;

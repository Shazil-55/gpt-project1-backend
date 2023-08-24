/*
  Warnings:

  - A unique constraint covering the columns `[liscenceKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_liscenceKey_key" ON "User"("liscenceKey");

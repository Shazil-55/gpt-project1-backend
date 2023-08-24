/*
  Warnings:

  - Added the required column `webPageUrl` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "webPageUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ExtendChat" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "ExtendChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExtendChat" ADD CONSTRAINT "ExtendChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

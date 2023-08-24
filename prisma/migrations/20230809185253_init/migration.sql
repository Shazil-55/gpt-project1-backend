-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "gpt" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "title" INTEGER NOT NULL,
    "showPrompt" BOOLEAN NOT NULL,
    "color" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

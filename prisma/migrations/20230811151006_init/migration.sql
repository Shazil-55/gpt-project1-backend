-- CreateTable
CREATE TABLE "ShortCuts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "keys" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ShortCuts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortCuts_userId_key" ON "ShortCuts"("userId");

-- AddForeignKey
ALTER TABLE "ShortCuts" ADD CONSTRAINT "ShortCuts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

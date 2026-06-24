/*
  Warnings:

  - You are about to drop the column `uderId` on the `Service` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_uderId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "uderId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

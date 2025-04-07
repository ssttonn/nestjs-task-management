/*
  Warnings:

  - You are about to drop the column `userId` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_userId_fkey";

-- DropIndex
DROP INDEX "tasks_id_title_description_status_createdAt_updatedAt_userI_idx";

-- DropIndex
DROP INDEX "tasks_title_userId_key";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER;

-- CreateIndex
CREATE INDEX "tasks_id_title_description_status_createdAt_updatedAt_idx" ON "tasks"("id", "title", "description", "status", "createdAt", "updatedAt");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

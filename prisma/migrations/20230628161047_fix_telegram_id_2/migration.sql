/*
  Warnings:

  - You are about to alter the column `idToken` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `telegramId` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `competitor` MODIFY `idToken` VARCHAR(191) NULL,
    MODIFY `telegramId` DOUBLE NULL;

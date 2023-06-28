/*
  Warnings:

  - You are about to drop the column `group` on the `competitor` table. All the data in the column will be lost.
  - You are about to drop the column `telegram` on the `competitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `competitor` DROP COLUMN `group`,
    DROP COLUMN `telegram`,
    ADD COLUMN `accessToken` VARCHAR(191) NULL,
    ADD COLUMN `active` BOOLEAN NULL,
    ADD COLUMN `contextGroup` VARCHAR(191) NULL,
    ADD COLUMN `idToken` VARCHAR(191) NULL,
    ADD COLUMN `refreshToken` VARCHAR(191) NULL,
    ADD COLUMN `telegramFirstName` VARCHAR(191) NULL,
    ADD COLUMN `telegramId` VARCHAR(191) NULL,
    ADD COLUMN `telegramLastName` VARCHAR(191) NULL,
    MODIFY `username` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `sQuizValutation` VARCHAR(191) NULL;

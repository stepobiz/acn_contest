/*
  Warnings:

  - You are about to alter the column `sQuizValutation` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(3,2)`.

*/
-- AlterTable
ALTER TABLE `competitor` MODIFY `sQuizValutation` DECIMAL(3, 2) NULL;

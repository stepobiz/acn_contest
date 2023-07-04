/*
  Warnings:

  - You are about to alter the column `sQuizValutation` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `competitor` MODIFY `sQuizValutation` DOUBLE NULL;

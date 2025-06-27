/*
  Warnings:

  - Added the required column `secretHash` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Session` ADD COLUMN `secretHash` VARCHAR(191) NOT NULL;

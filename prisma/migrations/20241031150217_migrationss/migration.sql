/*
  Warnings:

  - Added the required column `updatedAt` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `deletedAt` DATETIME(3) NULL, ADD COLUMN `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;



-- AlterTable
ALTER TABLE `Url` ADD COLUMN `deletedAt` DATETIME(3) NULL, ADD COLUMN `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

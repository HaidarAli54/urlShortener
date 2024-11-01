-- AlterTable
ALTER TABLE `Url` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

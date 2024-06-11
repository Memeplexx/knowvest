/*
  Warnings:

  - Made the column `date_updated` on table `note` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "note" ALTER COLUMN "date_updated" SET NOT NULL;

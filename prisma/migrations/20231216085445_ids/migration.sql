/*
  Warnings:

  - The primary key for the `note_tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `synonym_group` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "note_tag" DROP CONSTRAINT "note_tag_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "note_tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "synonym_group" DROP CONSTRAINT "synonym_group_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "synonym_group_pkey" PRIMARY KEY ("id");

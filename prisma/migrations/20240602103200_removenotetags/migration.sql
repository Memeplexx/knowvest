/*
  Warnings:

  - You are about to drop the `note_tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "note_tag" DROP CONSTRAINT "note_tag_note_id_fkey";

-- DropForeignKey
ALTER TABLE "note_tag" DROP CONSTRAINT "note_tag_tag_id_fkey";

-- DropTable
DROP TABLE "note_tag";

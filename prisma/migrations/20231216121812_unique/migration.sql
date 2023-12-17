/*
  Warnings:

  - A unique constraint covering the columns `[note_id,tag_id]` on the table `note_tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_id,synonym_id]` on the table `synonym_group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "note_tag_note_id_tag_id_key" ON "note_tag"("note_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "synonym_group_group_id_synonym_id_key" ON "synonym_group"("group_id", "synonym_id");

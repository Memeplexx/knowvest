import { Prisma } from "@prisma/client";
import { prisma } from "./_app";
import { NoteDTO, SynonymDTO, TagDTO, UserId } from "../dtos";

export const pruneOrphanedSynonymsAndSynonymGroups = async () => {
  const orphanedSynonyms = await prisma.$queryRaw<SynonymDTO[]>(Prisma.sql`
    SELECT s.* FROM synonym s 
      WHERE s.id NOT IN (SELECT t.synonym_id FROM tag t);`);
  const synonymGroupsToDelete = await prisma.synonymGroup.findMany({
    where: { synonymId: { in: orphanedSynonyms.map(s => s.id) } }
  });
  const deletedSynonymGroups = await prisma.$transaction(
    synonymGroupsToDelete.map(sg => prisma.synonymGroup.delete({ where: { groupId_synonymId: { groupId: sg.groupId, synonymId: sg.synonymId } } }))
  );
  const deletedSynonyms = await prisma.$transaction(
    orphanedSynonyms.map(synonym => prisma.synonym.delete({ where: { id: synonym.id } }))
  );
  return { deletedSynonymGroups, deletedSynonyms } as const;
}

export const listNotesWithTagText = async ({ userId, tagText }: { userId: UserId, tagText: string }) => {
  return await prisma.$queryRaw<NoteDTO[]>(Prisma.sql`
    SELECT n.* 
      FROM note n 
      WHERE n.user_id = ${userId} AND n.text ~* CONCAT('\\m', ${tagText}, '\\M');
    `
  );
}

export const listTagsWithTagText = async ({ userId, noteText }: { userId: UserId, noteText: string }) => {
  return await prisma.$queryRaw<TagDTO[]>(Prisma.sql`
    SELECT t.*
      FROM tag t
      WHERE t.user_id = ${userId} AND ${noteText} ~* CONCAT('\\m', t.text, '\\M');
    `
  );
}


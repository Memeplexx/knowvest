import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { FlashCardDTO, FlashCardId, GroupDTO, GroupId, NoteDTO, NoteId, NoteTagDTO, NoteTagId, SynonymDTO, SynonymGroupDTO, SynonymGroupId, SynonymId, TagDTO, TagId, UserId } from "@/actions/types";
import { FlashCard, Group, Note, NoteTag, Prisma, PrismaClient, Synonym, SynonymGroup, Tag, User } from "@prisma/client";
import { getServerSession } from "next-auth";

export const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

export const archiveAllEntitiesAssociatedWithAnyArchivedTags = async (userId: UserId) => {

  const noteTagIdsToArchive = (await prisma.$queryRaw<NoteDTO[]>(Prisma.sql`
    SELECT nt.id FROM note_tag nt 
      JOIN note n on nt.note_id = n.id
      JOIN tag t on nt.tag_id = t.id
      WHERE n.user_id = ${userId} AND nt.is_archived IS FALSE AND t.is_archived IS TRUE;
  `)).map(nt => nt.id);
  await prisma.noteTag.updateMany({ where: { id: { in: noteTagIdsToArchive } }, data: { isArchived: true } });
  const noteTags = await prisma.noteTag.findMany({ where: { id: { in: noteTagIdsToArchive } } });

  const synonymIdsToArchive = (await prisma.$queryRaw<SynonymDTO[]>(Prisma.sql`
    SELECT DISTINCT s.id FROM synonym s 
      JOIN tag t on t.synonym_id = s.id
      WHERE t.user_id = ${userId} AND s.is_archived IS FALSE AND t.is_archived IS TRUE;
  `)).map(s => s.id);
  await prisma.synonym.updateMany({ where: { id: { in: synonymIdsToArchive } }, data: { isArchived: true } });
  const synonyms = await prisma.synonym.findMany({ where: { id: { in: synonymIdsToArchive } } });

  const synonymGroupIdsToArchive = (await prisma.$queryRaw<SynonymDTO[]>(Prisma.sql`
    SELECT DISTINCT sg.id FROM synonym_group sg 
      JOIN synonym s on sg.synonym_id = s.id
      JOIN tag t on t.synonym_id = s.id
      WHERE t.user_id = ${userId} AND sg.is_archived IS FALSE AND t.is_archived IS TRUE;
  `)).map(sg => sg.id);
  await prisma.synonymGroup.updateMany({ where: { id: { in: synonymGroupIdsToArchive } }, data: { isArchived: true } });
  const synonymGroups = await prisma.synonymGroup.findMany({ where: { id: { in: synonymGroupIdsToArchive } } });

  return { synonymGroups, synonyms, noteTags } as const;
}

export const listUnArchivedNoteIdsWithTagText = async ({ userId, tagText }: { userId: UserId, tagText: string }) => {
  return (await prisma.$queryRaw<NoteDTO[]>(Prisma.sql`
    SELECT n.id 
      FROM note n 
      WHERE n.is_archived IS FALSE AND n.user_id = ${userId} AND n.text ~* CONCAT('\\m', ${tagText}, '\\M');
  `)).map(n => n.id);
}

export const listUnArchivedTagIdsWithTagText = async ({ userId, noteText }: { userId: UserId, noteText: string }) => {
  return (await prisma.$queryRaw<TagDTO[]>(Prisma.sql`
    SELECT t.id
      FROM tag t
      WHERE t.is_archived IS FALSE AND t.user_id = ${userId} AND ${noteText} ~* CONCAT('\\m', t.text, '\\M');
  `)).map(t => t.id);
}

export type EntityToDto<T>
  = T extends Note ? NoteDTO
  : T extends FlashCard ? FlashCardDTO
  : T extends Tag ? TagDTO
  : T extends NoteTag ? NoteTagDTO
  : T extends Group ? GroupDTO
  : T extends SynonymGroup ? SynonymGroupDTO
  : T extends Synonym ? SynonymDTO
  : T extends Array<infer E> ? Array<EntityToDto<E>>
  : T extends { [key: string]: unknown } ? { [key in keyof T]: EntityToDto<T[key]> }
  : T

export const receive = <T extends Record<string, unknown>>() => <R>(processor: (a: T) => R) => async (arg: T) => {
  const result = (await processor(arg));
  return result as EntityToDto<typeof result>;
}

const validateId = async <R>(entityName: string, query: (user: { email: string }) => Promise<R>) => {
  const session = await getServerSession(authOptions);
  const result = await query({ email: session!.user!.email! });
  if (!result) { throw new ApiError('NOT_FOUND', `${entityName} not found`); }
  return result;
}

export const validateFlashCardId = async (flashCardId: FlashCardId) =>
  await validateId('Flash Card', async user => await prisma.flashCard.findFirst({ where: { id: flashCardId, note: { user } } }));
export const validateGroupId = async (groupId: GroupId) =>
  await validateId('Group', async user => await prisma.group.findFirst({ where: { id: groupId, user } }));
export const validateSynonymId = async (synonymId: SynonymId) =>
  await validateId('Synonym', async user => prisma.synonym.findFirstOrThrow({ where: { id: synonymId, tag: { some: { user } } } }));
export const validateSynonymGroupId = async (synonymGroupId: SynonymGroupId) =>
  await validateId('Synonym Group', async user => prisma.synonymGroup.findFirstOrThrow({ where: { id: synonymGroupId, group: { user } } }));
export const validateNoteId = async (noteId: NoteId) =>
  await validateId('Note', async user => prisma.note.findFirstOrThrow({ where: { id: noteId, user } }));
export const validateTagId = async (tagId: TagId) =>
  await validateId('Tag', async user => prisma.tag.findFirstOrThrow({ where: { id: tagId, user } }));
export const getUserId = async () => {
  const session = await getServerSession(authOptions);
  const result = await prisma.user.findFirst({ where: { email: session!.user!.email! } });
  if (!result) { throw new ApiError('NOT_FOUND', `User not found`); }
  return result.id as UserId;
}

export class ApiError extends Error {
  constructor(readonly code: 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST', readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

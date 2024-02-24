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

export const listNotesWithTagText = async ({ userId, tagText }: { userId: UserId, tagText: string }) => {
  return await prisma.$queryRaw<NoteDTO[]>(Prisma.sql`
    SELECT n.* 
      FROM note n 
      WHERE n.user_id = ${userId} AND n.text ~* CONCAT('\\m', ${tagText}, '\\M');
  `);
}

export const listTagsWithTagText = async ({ userId, noteText }: { userId: UserId, noteText: string }) => {
  return await prisma.$queryRaw<TagDTO[]>(Prisma.sql`
    SELECT t.*
      FROM tag t
      WHERE t.user_id = ${userId} AND ${noteText} ~* CONCAT('\\m', t.text, '\\M');
  `);
}


type Arg<T, Id, Name extends string, Entity> = { [P in keyof T as T[P] extends Id ? Name : never]: Entity }
type processorArgs<T> = T
  & Arg<T, NoteId, 'note', Note>
  & Arg<T, TagId, 'tag', Tag>
  & Arg<T, FlashCardId, 'flashCard', FlashCard>
  & Arg<T, SynonymId, 'synonym', Synonym>
  & Arg<T, SynonymGroupId, 'synonymGroup', SynonymGroup>
  & Arg<T, NoteTagId, 'noteTag', NoteTag>
  & Arg<T, GroupId, 'group', Group>
  & { userId: UserId, user: User }
  ;

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

const fetchItem = async <T, ID extends number | undefined>(id: ID, fetcher: (id: ID) => Promise<T | null>) => {
  if (!id) { return null as T; }
  return await fetcher(id);
};

export const receive = <T extends Partial<{ noteId: NoteId, tagId: TagId, flashCardId: FlashCardId, synonymId: SynonymId, groupId: GroupId, [key: string]: unknown }>>() => <R>(processor: (a: processorArgs<T>) => R) => {
  return async (arg: T) => {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({ where: { email: session!.user!.email! } });
    const userId = user?.id as UserId;
    const result = (await processor({
      ...arg,
      userId,
      user,
      note: await fetchItem(arg.noteId, id => prisma.note.findFirstOrThrow({ where: { id, userId } })),
      tag: await fetchItem(arg.tagId, id => prisma.tag.findFirstOrThrow({ where: { id, userId } })),
      flashCard: await fetchItem(arg.flashCardId, id => prisma.flashCard.findFirstOrThrow({ where: { id, note: { userId } } })),
      group: await fetchItem(arg.groupId, id => prisma.group.findFirstOrThrow({ where: { id, userId } })),
      synonym: await fetchItem(arg.synonymId, id => prisma.synonym.findFirst({ where: { id, tag: { some: { userId } } } })),
    } as processorArgs<T>));
    return result as EntityToDto<typeof result>;
  }
}

export class ApiError extends Error {
  constructor(readonly code: 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST', readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

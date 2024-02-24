import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { EntityToDto, FlashCardId, GroupId, NoteDTO, NoteId, SynonymDTO, SynonymId, TagDTO, TagId, UserId } from "@/actions/types";
import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ZodNumberDef, ZodRawShape, ZodType, z } from "zod";

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

export const receive = <T extends ZodRawShape>(spec: T) => {
  return {
    then: <R>(processor: (a: z.infer<z.ZodObject<typeof spec>> & { userId: UserId }) => Promise<R>) => {
      return async (arg: z.infer<z.ZodObject<typeof spec>>) => {
        const parseResponse = z.object(spec).safeParse(arg);
        if (!parseResponse.success) {
          throw new ApiError('BAD_REQUEST', 'Invalid request');
        } else {
          const session = await getServerSession(authOptions);
          const userId = (await prisma.user.findFirstOrThrow({ where: { email: session!.user!.email! } })).id as UserId;
          return processor({
            ...parseResponse.data,
            userId,
          }) as EntityToDto<R>;
        }
      }
    }
  }
}

export class ApiError extends Error {
  constructor(readonly code: 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST', readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const noteId = () => z.number() as unknown as ZodType<NoteId, ZodNumberDef>;
export const tagId = () => z.number() as unknown as ZodType<TagId, ZodNumberDef>;
export const groupId = () => z.number() as unknown as ZodType<GroupId, ZodNumberDef>;
export const synonymId = () => z.number() as unknown as ZodType<SynonymId, ZodNumberDef>;
export const userId = () => z.number() as unknown as ZodType<UserId, ZodNumberDef>;
export const flashCardId = () => z.number() as unknown as ZodType<FlashCardId, ZodNumberDef>;

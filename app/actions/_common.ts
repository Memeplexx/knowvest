import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { FlashCardDTO, GroupDTO, NoteDTO, NoteTagDTO, SynonymDTO, SynonymGroupDTO, TagDTO, UserId } from "@/server/dtos";
import { FlashCard, Group, Note, NoteTag, Prisma, PrismaClient, Synonym, SynonymGroup, Tag } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ZodRawShape, z } from "zod";

export const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

export async function getUserId() {
  const session = await getServerSession(authOptions);
  return (await prisma.user.findFirstOrThrow({ where: { email: session!.user!.email! } })).id as UserId;
}

export const pruneOrphanedSynonymsAndSynonymGroups = async () => {
  const orphanedSynonyms = await prisma.$queryRaw<SynonymDTO[]>(Prisma.sql`
    SELECT s.* FROM synonym s 
      WHERE s.id NOT IN (SELECT t.synonym_id FROM tag t);`);
  const synonymGroupsToArchive = await prisma.synonymGroup.findMany({
    where: { synonymId: { in: orphanedSynonyms.map(s => s.id) } }
  });
  const orphanedSynonymGroupIds = synonymGroupsToArchive.map(sg => sg.id);
  await prisma.synonymGroup.updateMany({ where: { id: { in: orphanedSynonymGroupIds } }, data: { isArchived: true } });
  const archivedSynonymGroups = await prisma.synonymGroup.findMany({ where: { id: { in: orphanedSynonymGroupIds } } });
  const orphanedSynonymIds = archivedSynonymGroups.map(sg => sg.synonymId);
  await prisma.synonym.updateMany({ where: { id: { in: orphanedSynonymIds } }, data: { isArchived: true } });
  const archivedSynonyms = await prisma.synonym.findMany({ where: { id: { in: orphanedSynonymGroupIds } } });
  return { archivedSynonymGroups, archivedSynonyms } as const;
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

export const receive = <T extends ZodRawShape>(spec: T) => {
  return {
    then: <R>(processor: (a: z.infer<z.ZodObject<typeof spec>> & { userId: UserId }) => Promise<R>) => {
      return async (arg: z.infer<z.ZodObject<typeof spec>>) => {
        const parseResponse = z.object(spec).safeParse(arg);
        if (!parseResponse.success) {
          throw new ApiError('BAD_REQUEST', 'Invalid request');
        } else {
          return processor({
            ...parseResponse.data,
            userId: await getUserId()
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

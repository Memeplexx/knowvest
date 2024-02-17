import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { DatelessObject, EntityToDto, FlashCardId, GroupId, NoteDTO, NoteId, SynonymDTO, SynonymId, TagDTO, TagId, UserId } from "@/utils/types";
import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ZodNumberDef, ZodRawShape, ZodType, z } from "zod";

export const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

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

// export const receive = <T extends ZodRawShape>(spec: T) => {
//   return {
//     then: <R>(processor: (a: z.infer<z.ZodObject<typeof spec>> & { userId: UserId }) => Promise<R>) => {
//       return async (arg: z.infer<z.ZodObject<typeof spec>>) => {
//         const parseResponse = z.object(spec).safeParse(arg);
//         if (!parseResponse.success) {
//           throw new ApiError('BAD_REQUEST', 'Invalid request');
//         } else {
//           const session = await getServerSession(authOptions);
//           const userId = (await prisma.user.findFirstOrThrow({ where: { email: session!.user!.email! } })).id as UserId;
//           const response = await processor({
//             ...parseResponse.data,
//             userId,
//           });
//           const replaceDatesWithStrings = <X>(arg: X): DatelessObject<X> => {
//             return (arg === null ? null
//               : Array.isArray(arg) ? arg.map(a => replaceDatesWithStrings(a))
//                 : typeof (arg) === 'object' ? (Object.keys(arg) as Array<keyof X>)
//                   .mapToObject(k => k, k => replaceDatesWithStrings(arg[k])) : arg instanceof Date ? arg.toISOString() : arg
//             ) as DatelessObject<X>;
//           }
//           return replaceDatesWithStrings(response as EntityToDto<R>);
//         }
//       }
//     }
//   }
// }
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

export const ZodNoteId = z.number() as unknown as ZodType<NoteId, ZodNumberDef>;
export const ZodTagId = z.number() as unknown as ZodType<TagId, ZodNumberDef>;
export const ZodGroupId = z.number() as unknown as ZodType<GroupId, ZodNumberDef>;
export const ZodSynonymId = z.number() as unknown as ZodType<SynonymId, ZodNumberDef>;
export const ZodUserId = z.number() as unknown as ZodType<UserId, ZodNumberDef>;
export const ZodFlashCardId = z.number() as unknown as ZodType<FlashCardId, ZodNumberDef>;

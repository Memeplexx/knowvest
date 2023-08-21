import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodNoteId, ZodTagId } from '../dtos';
import { TRPCError } from '@trpc/server';


export const noteTagRouter = router({

  noteTagsUpdate: procedure
    .input(z.object({
      noteId: ZodNoteId,
      addTagIds: z.array(ZodTagId),
      removeTagIds: z.array(ZodTagId),
    }))
    .mutation(async ({ ctx: { userId }, input: { addTagIds, noteId, removeTagIds } }) => {

      // Validation
      const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
      if (!note) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found' }); }
      await [...addTagIds, ...removeTagIds].map(async tagId => {
        const tag = await prisma.tag.findFirst({ where: { id: tagId, userId } });
        if (!tag) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Tag not found' }); }
      });

      // Logic
      if (addTagIds.length) {
        await prisma.noteTag.createMany({ data: addTagIds.map(tagId => ({ tagId, noteId })), skipDuplicates: true });
      }
      if (removeTagIds.length) {
        await prisma.noteTag.deleteMany({ where: { noteId, tagId: { in: removeTagIds } } });
      }
      return await prisma.noteTag.findMany({ where: { noteId } });
    }),
});


import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodFlashCardId, ZodNoteId, ZodTagId } from '../dtos';
import { TRPCError } from '@trpc/server';
import { add } from 'date-fns';


export const flashCardRouter = router({

  listForNote: procedure
    .input(z.object({
      noteId: ZodNoteId,
    }))
    .query(async ({ ctx: { userId }, input: { noteId } }) => {

      // Validation
      const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
      if (!note) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found' }); }

      // Logic
      const flashCards = await prisma.flashCard.findMany({ where: { noteId } });
      return { status: 'FLASH CARDS FOUND', flashCards };
    }),

  listForTest: procedure
    .query(async ({ ctx: { userId } }) => {

      // Logic
      const flashCards = await prisma.flashCard.findMany({ where: { nextQuestionDate: new Date(), note: { userId } } });
      return { status: 'FLASH CARDS FOUND', flashCards };
    }),

  create: procedure
    .input(z.object({
      noteId: ZodNoteId,
    }))
    .mutation(async ({ ctx: { userId }, input: { noteId } }) => {

      // Validation
      const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
      if (!note) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found' }); }

      // Logic
      const flashCard = await prisma.flashCard.create({ data: { noteId, text: '', cleanRunCount: 0, nextQuestionDate: add(new Date(), { days: 1 }) } });
      return { status: 'FLASH CARD CREATED', flashCard };
    }),

  updateText: procedure
    .input(z.object({
      id: ZodFlashCardId,
      text: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { id, text } }) => {

      // Validation
      const flashCard = await prisma.flashCard.findFirst({ where: { id } });
      if (!flashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      const updatedFlashCard = await prisma.flashCard.update({ where: { id }, data: { text } });
      return { status: 'FLASH CARD UPDATED', flashCard: updatedFlashCard };
    }),

  delete: procedure
    .input(z.object({
      id: ZodFlashCardId,
    }))
    .mutation(async ({ ctx: { userId }, input: { id } }) => {

      // Validation
      const flashCard = await prisma.flashCard.findFirst({ where: { id } });
      if (!flashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      await prisma.flashCard.delete({ where: { id } });
      return { status: 'FLASH CARD DELETED', flashCard };
    }),
});


import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodFlashCardId, ZodNoteId } from '../dtos';
import { TRPCError } from '@trpc/server';
import { add } from 'date-fns';


export const flashCardRouter = router({

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
      const flashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
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
      const flashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
      if (!flashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      await prisma.flashCard.delete({ where: { id } });
      return { status: 'FLASH CARD DELETED', flashCard };
    }),

  answerQuestionCorrectly: procedure
    .input(z.object({
      id: ZodFlashCardId,
    }))
    .mutation(async ({ ctx: { userId }, input: { id } }) => {

      // Validation
      const flashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
      if (!flashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      const cleanRunCount = flashCard.cleanRunCount + 1;
      const nextQuestionDate = add(new Date(), { days: flashCard.cleanRunCount + 1 }); // TODO: consider using a more sophisticated algorithm for spaced repitition
      const updatedFlashCard = await prisma.flashCard.update({ where: { id }, data: { cleanRunCount, nextQuestionDate } });
      return { status: 'FLASH CARD UPDATED', flashCard: updatedFlashCard };
    }),

  answerQuestionIncorrectly: procedure
    .input(z.object({
      id: ZodFlashCardId,
    }))
    .mutation(async ({ ctx: { userId }, input: { id } }) => {
      
      // Validation
      const flashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
      if (!flashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      const cleanRunCount = 0;
      const nextQuestionDate = add(new Date(), { days: 1 });
      const updatedFlashCard = await prisma.flashCard.update({ where: { id }, data: { cleanRunCount, nextQuestionDate } });
      return { status: 'FLASH CARD UPDATED', flashCard: updatedFlashCard };
    }),
});

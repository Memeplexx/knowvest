import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodFlashCardId, ZodNoteId } from '../dtos';
import { TRPCError } from '@trpc/server';
import { add } from 'date-fns';


export const flashCardRouter = router({

  list: procedure
    .input(z.object({
      after: z.date().nullish(),
    }))
    .query(async ({ ctx: { userId }, input: { after } }) => {
      
      // Logic
      const flashCards = !after
        ? await prisma.flashCard.findMany({ where: { note: { userId } }, orderBy: { dateUpdated: 'desc' } })
        : await prisma.flashCard.findMany({ where: { note: { userId }, dateUpdated: { gt: after } }, orderBy: { dateUpdated: 'desc' } });

      // Populate and return response
      return { status: 'FLASHCARDS_LISTED', flashCards } as const;
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
      const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
      if (!existingFlashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      const flashCard = await prisma.flashCard.update({ where: { id }, data: { text } });
      return { status: 'FLASH CARD UPDATED', flashCard };
    }),

  archive: procedure
    .input(z.object({
      id: ZodFlashCardId,
    }))
    .mutation(async ({ ctx: { userId }, input: { id } }) => {

      // Validation
      const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
      if (!existingFlashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      const flashCard = await prisma.flashCard.update({ where: { id }, data: { isArchived: true } });
      return { status: 'FLASH CARD ARCHIVED', flashCard };
    }),

  answerQuestionCorrectly: procedure
    .input(z.object({
      id: ZodFlashCardId,
    }))
    .mutation(async ({ ctx: { userId }, input: { id } }) => {

      // Validation
      const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
      if (!existingFlashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      const cleanRunCount = existingFlashCard.cleanRunCount + 1;
      const nextQuestionDate = add(new Date(), { days: existingFlashCard.cleanRunCount + 1 }); // TODO: consider using a more sophisticated algorithm for spaced repitition
      const flashCard = await prisma.flashCard.update({ where: { id }, data: { cleanRunCount, nextQuestionDate } });
      return { status: 'FLASH CARD UPDATED', flashCard };
    }),

  answerQuestionIncorrectly: procedure
    .input(z.object({
      id: ZodFlashCardId,
    }))
    .mutation(async ({ ctx: { userId }, input: { id } }) => {
      
      // Validation
      const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
      if (!existingFlashCard) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Flash card not found' }); }

      // Logic
      const cleanRunCount = 0;
      const nextQuestionDate = add(new Date(), { days: 1 });
      const flashCard = await prisma.flashCard.update({ where: { id }, data: { cleanRunCount, nextQuestionDate } });
      return { status: 'FLASH CARD UPDATED', flashCard };
    }),
});

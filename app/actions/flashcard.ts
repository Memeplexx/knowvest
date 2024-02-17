"use server";
import { receive, prisma, ApiError, ZodFlashCardId, ZodNoteId } from "./_common";
import { z } from "zod";
import add from "date-fns/add";


export const createFlashCard = receive({
  noteId: ZodNoteId,
}).then(async ({ userId, noteId }) => {

  // Validation
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) { throw new ApiError('NOT_FOUND', 'Note not found'); }

  // Logic
  const flashCard = await prisma.flashCard.create({ data: { noteId, text: '', cleanRunCount: 0, nextQuestionDate: add(new Date(), { days: 1 }) } });
  return { status: 'FLASH CARD CREATED', flashCard };
});

export const updateFlashCardText = receive({
  id: ZodFlashCardId,
  text: z.string(),
}).then(async ({ userId, id, text }) => {

  // Validation
  const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
  if (!existingFlashCard) { throw new ApiError('NOT_FOUND', 'Flash card not found'); }

  // Logic
  const flashCard = await prisma.flashCard.update({ where: { id }, data: { text } });
  return { status: 'FLASH CARD UPDATED', flashCard };
});

export const archiveFlashCard = receive({
  id: ZodFlashCardId,
}).then(async ({ userId, id }) => {

  // Validation
  const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
  if (!existingFlashCard) { throw new ApiError('NOT_FOUND', 'Flash card not found'); }

  // Logic
  const flashCard = await prisma.flashCard.update({ where: { id }, data: { isArchived: true } });
  return { status: 'FLASH CARD ARCHIVED', flashCard };
});

export const answerFlashCardQuestionCorrectly = receive({
  id: ZodFlashCardId,
}).then(async ({ userId, id }) => {

  // Validation
  const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
  if (!existingFlashCard) { throw new ApiError('NOT_FOUND', 'Flash card not found'); }

  // Logic
  const cleanRunCount = existingFlashCard.cleanRunCount + 1;
  const nextQuestionDate = add(new Date(), { days: existingFlashCard.cleanRunCount + 1 }); // TODO: consider using a more sophisticated algorithm for spaced repitition
  const flashCard = await prisma.flashCard.update({ where: { id }, data: { cleanRunCount, nextQuestionDate } });
  return { status: 'FLASH CARD UPDATED', flashCard };
});

export const answerFlashCardQuestionIncorrectly = receive({
  id: ZodFlashCardId,
}).then(async ({ userId, id }) => {

  // Validation
  const existingFlashCard = await prisma.flashCard.findFirst({ where: { id, note: { userId } } });
  if (!existingFlashCard) { throw new ApiError('NOT_FOUND', 'Flash card not found'); }

  // Logic
  const cleanRunCount = 0;
  const nextQuestionDate = add(new Date(), { days: 1 });
  const flashCard = await prisma.flashCard.update({ where: { id }, data: { cleanRunCount, nextQuestionDate } });
  return { status: 'FLASH CARD UPDATED', flashCard };
});

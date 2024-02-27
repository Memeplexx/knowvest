"use server";
import add from "date-fns/add";
import { prisma, receive, validateFlashCardId, validateNoteId } from "./_common";
import { FlashCardId, NoteId } from "./types";


export const createFlashCard = receive<{
  noteId: NoteId,
}>()(async ({ noteId, userId }) => {

  // Validate
  await validateNoteId({ noteId, userId });

  // Logic
  const flashCard = await prisma.flashCard.create({ data: { noteId, text: '', cleanRunCount: 0, nextQuestionDate: add(new Date(), { days: 1 }) } });
  return { status: 'FLASH CARD CREATED', flashCard } as const;
});

export const updateFlashCardText = receive<{
  flashCardId: FlashCardId,
  text: string,
}>()(async ({ flashCardId, userId, text }) => {

  // Validate
  await validateFlashCardId({ flashCardId, userId });

  // Logic
  const flashCard = await prisma.flashCard.update({ where: { id: flashCardId }, data: { text } });
  return { status: 'FLASH CARD UPDATED', flashCard };
});

export const archiveFlashCard = receive<{
  flashCardId: FlashCardId,
}>()(async ({ flashCardId, userId }) => {

  // Validate
  await validateFlashCardId({ flashCardId, userId });

  // Logic
  const flashCard = await prisma.flashCard.update({ where: { id: flashCardId }, data: { isArchived: true } });
  return { status: 'FLASH CARD ARCHIVED', flashCard };
});

export const answerFlashCardQuestionCorrectly = receive<{
  flashCardId: FlashCardId,
}>()(async ({ flashCardId, userId }) => {

  // Validate
  const flashCard = await validateFlashCardId({ flashCardId, userId });

  // Logic
  const cleanRunCount = flashCard.cleanRunCount + 1;
  const nextQuestionDate = add(new Date(), { days: flashCard.cleanRunCount + 1 }); // TODO: consider using a more sophisticated algorithm for spaced repitition
  const flashCardUpdated = await prisma.flashCard.update({ where: { id: flashCardId }, data: { cleanRunCount, nextQuestionDate } });
  return { status: 'FLASH CARD UPDATED', flashCard: flashCardUpdated };
});

export const answerFlashCardQuestionIncorrectly = receive<{
  flashCardId: FlashCardId,
}>()(async ({ flashCardId, userId }) => {

  // Validate
  await validateFlashCardId({ flashCardId, userId });

  // Logic
  const cleanRunCount = 0;
  const nextQuestionDate = add(new Date(), { days: 1 });
  const flashCardUpdated = await prisma.flashCard.update({ where: { id: flashCardId }, data: { cleanRunCount, nextQuestionDate } });
  return { status: 'FLASH CARD UPDATED', flashCard: flashCardUpdated };
});

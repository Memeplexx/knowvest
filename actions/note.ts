"use server";
import { NoteId } from "@/actions/types";
import { Note } from "@prisma/client";
import { getUserId, prisma, respond, validateNoteId } from "./_common";


export const createNote = () => respond(async () => {

  // Create a new note
  const now = new Date();
  const userId = await getUserId();
  const note = await prisma.note.create({ data: { userId, text: '', dateCreated: now, dateUpdated: now } });

  // Populate and return response
  return { status: 'NOTE_CREATED', note } as const;
});

export const archiveNote = (noteId: NoteId) => respond(async () => {

  // Validate
  await validateNoteId(noteId);

  // Archive note
  const note = await prisma.note.update({ where: { id: noteId }, data: { isArchived: true } });

  // Populate and return response
  return { status: 'NOTE_ARCHIVED', note } as const;
});

export const duplicateNote = (noteId: NoteId) => respond(async () => {

  // Validate
  const userId = await getUserId();
  const note = await validateNoteId(noteId);

  // Create a new note with the same text as the note being duplicated
  const now = new Date();
  const noteCreated = await prisma.note.create({ data: { userId, text: note.text, dateCreated: now, dateUpdated: now } });

  // Populate and return response
  return { status: 'NOTE_DUPLICATED', note: noteCreated } as const;
});

export const splitNote = (from: number, to: number, noteId: NoteId) => respond(async () => {

  // Validate
  const userId = await getUserId();
  const note = await validateNoteId(noteId);

  // Create new note with the split text
  const now = new Date();
  const noteCreated = await prisma.note.create({ data: { userId, text: note.text.slice(from, to), dateUpdated: now, dateCreated: now } });

  // Update the existing note by removing the split text
  const noteUpdated = await prisma.note.update({ where: { id: noteId }, data: { text: `${note.text.slice(0, from)}${note.text.slice(to)}`, dateUpdated: now } });

  // Populate and return response
  return { status: 'NOTE_SPLIT', notes: [noteCreated, noteUpdated] as Note[] } as const;
});

export const updateNote = (noteId: NoteId, text: string) => respond(async () => {

  // Validate
  await validateNoteId(noteId);

  // Update note
  const now = new Date();
  const note = await prisma.note.update({ where: { id: noteId }, data: { text, dateUpdated: now } });

  // Populate and return response
  return { status: 'NOTE_UPDATED', note } as const;
});

export const viewNote = (noteId: NoteId) => respond(async () => {

  // Validate
  await validateNoteId(noteId);

  // Update note
  const note = await prisma.note.update({ where: { id: noteId }, data: { dateUpdated: new Date() } });

  // Populate and return response
  return { status: 'NOTE_VIEWED', note } as const;
});

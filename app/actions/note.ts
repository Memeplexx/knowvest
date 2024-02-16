"use server";
import { NoteDTO, NoteTagDTO, ZodNoteId } from "@/server/dtos";
import { NotFoundError, receive, getUserId, listTagsWithTagText, prisma } from "./_common";
import { z } from "zod";


export const createNote = receive({
}).then(async ({ userId }) => {

  // Create a new note
  const now = new Date();
  const note = await prisma.note.create({ data: { userId, text: '', dateUpdated: now, dateViewed: now } }) as NoteDTO;

  // Populate and return response
  return { status: 'NOTE_CREATED', note } as const;
})

export const archiveNote = receive({
  noteId: ZodNoteId,
}).then(async ({ noteId, userId }) => {

  // Validate
  const noteToArchive = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!noteToArchive) { throw new NotFoundError('Note not found'); }

  // Archive all note tags associated with the note that is being archived
  const noteTagsToBeArchived = await prisma.noteTag.findMany({ where: { noteId } })
  const idsOfNoteTagsToBeArchived = noteTagsToBeArchived.map(nt => nt.id);
  await prisma.noteTag.updateMany({ where: { id: { in: idsOfNoteTagsToBeArchived } }, data: { isArchived: true } });
  const archivedNoteTags = await prisma.noteTag.findMany({ where: { id: { in: idsOfNoteTagsToBeArchived } } }) as NoteTagDTO[];

  // Archive note
  const noteArchived = await prisma.note.update({ where: { id: noteId }, data: { isArchived: true } }) as NoteDTO;

  // Populate and return response
  return { status: 'NOTE_ARCHIVED', noteArchived, archivedNoteTags } as const;
})

export const duplicateNote = receive({
  noteId: ZodNoteId
}).then(async ({ noteId, userId }) => {

  // Logic
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) { throw new NotFoundError('Note not found'); }

  // Create a new note with the same text as the note being duplicated
  const now = new Date();
  const noteCreated = await prisma.note.create({ data: { userId, text: note.text, dateUpdated: now, dateViewed: now } }) as NoteDTO;

  // Create new note tags with the same tag ids as the note being duplicated
  const noteTags = await prisma.noteTag.findMany({ where: { noteId } });
  const noteTagTagIds = noteTags.map(nt => nt.tagId);
  await prisma.noteTag.createMany({ data: noteTagTagIds.map(tagId => ({ noteId: noteCreated.id, tagId })) });

  // Populate and return response
  const noteTagsCreated = await prisma.noteTag.findMany({ where: { noteId: noteCreated.id, tagId: { in: noteTagTagIds } } }) as NoteTagDTO[];
  return { status: 'NOTE_DUPLICATED', noteCreated, noteTagsCreated } as const;
})

export const splitNote = receive({
  splitFromNoteId: ZodNoteId,
  from: z.number(),
  to: z.number(),
}).then(async ({ from, splitFromNoteId, to }) => {

  const userId = await getUserId();
  const note = await prisma.note.findFirst({ where: { id: splitFromNoteId } });
  if (!note) { throw new NotFoundError('Could not find note'); }

  // Create new note with the split text
  const now = new Date();
  const noteCreated = await prisma.note.create({ data: { userId, text: note.text.slice(from, to), dateUpdated: now, dateViewed: now } });

  // Create new note tags for the new note
  const tagsToBeAssigned = await listTagsWithTagText({ userId, noteText: noteCreated.text });
  const tagIdsToBeAssigned = tagsToBeAssigned.map(tag => tag.id);
  await prisma.noteTag.createMany({ data: tagIdsToBeAssigned.map(tagId => ({ noteId: noteCreated.id, tagId })) });

  // Update the existing note by removing the split text
  const noteUpdated = await prisma.note.update({ where: { id: splitFromNoteId }, data: { text: `${note.text.slice(0, from)}${note.text.slice(to)}`, dateUpdated: now, dateViewed: now } });

  // Archive note tags that are no longer associated with the existing note
  const tagsUpdatedForExistingNote = await listTagsWithTagText({ userId, noteText: noteUpdated.text });
  const tagIdsUpdatedForExistingNote = tagsUpdatedForExistingNote.map(tag => tag.id);
  const noteTagsForExistingNote = await prisma.noteTag.findMany({ where: { noteId: splitFromNoteId } }) as NoteTagDTO[];
  const tagIdsToBeUnassignedFromExistingNote = noteTagsForExistingNote.map(noteTag => noteTag.tagId).filter(id => !tagIdsUpdatedForExistingNote.includes(id));
  const noteTagsToBeArchived = await prisma.noteTag.findMany({ where: { noteId: splitFromNoteId, tagId: { in: tagIdsToBeUnassignedFromExistingNote } } });
  const idsOfNoteTagsToBeArchived = noteTagsToBeArchived.map(nt => nt.id);
  await prisma.noteTag.updateMany({ where: { id: { in: idsOfNoteTagsToBeArchived } }, data: { isArchived: true } });

  // Populate and return response
  const archivedNoteTags = await prisma.noteTag.findMany({ where: { id: { in: idsOfNoteTagsToBeArchived } } });
  const newNoteTags = await prisma.noteTag.findMany({ where: { noteId: noteCreated.id, tagId: { in: tagIdsToBeAssigned } } });
  return { status: 'NOTE_SPLIT', notes: [noteCreated, noteUpdated] as NoteDTO[], noteTags: [...newNoteTags, ...archivedNoteTags] as NoteTagDTO[] } as const;
});

export const updateNote = receive({
  noteId: ZodNoteId,
  text: z.string(),
}).then(async ({ userId, noteId, text }) => {

  // Validation
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) { throw new NotFoundError('Note not found'); }

  // Update note
  const now = new Date();
  const updatedNote = await prisma.note.update({ where: { id: noteId }, data: { text, dateUpdated: now, dateViewed: now } });

  // Populate and return response
  return { status: 'NOTE_UPDATED', updatedNote } as const;
});

export const viewNote = receive({
  noteId: ZodNoteId,
}).then(async ({ userId, noteId }) => {

  // Validate
  const noteToView = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!noteToView) { throw new NotFoundError('Note not found'); }

  // Update note
  const note = await prisma.note.update({ where: { id: noteId }, data: { dateViewed: new Date() } });

  // Populate and return response
  return { status: 'NOTE_VIEWED', note } as const;
})

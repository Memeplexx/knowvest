"use server";
import { NoteId, NoteTagId, TagId } from "@/actions/types";
import { listUnArchivedTagIdsWithTagText, prisma, receive, validateNoteId } from "./_common";


export const createNote = receive(
)(async ({ userId }) => {

  // Create a new note
  const now = new Date();
  const note = await prisma.note.create({ data: { userId, text: '', dateUpdated: now, dateViewed: now } });

  // Populate and return response
  return { status: 'NOTE_CREATED', note } as const;
})

export const archiveNote = receive<{
  noteId: NoteId
}>()(async ({ noteId, userId }) => {

  // Validate
  await validateNoteId({ noteId, userId });

  // Archive all note tags associated with the note that is being archived
  const idsOfNoteTagsToBeArchived = (await prisma.noteTag.findMany({ where: { noteId }, select: { id: true } })).map(nt => nt.id);
  await prisma.noteTag.updateMany({ where: { id: { in: idsOfNoteTagsToBeArchived } }, data: { isArchived: true } });
  const noteTags = await prisma.noteTag.findMany({ where: { id: { in: idsOfNoteTagsToBeArchived } } });

  // Archive note
  const note = await prisma.note.update({ where: { id: noteId }, data: { isArchived: true } });

  // Populate and return response
  return { status: 'NOTE_ARCHIVED', note, noteTags } as const;
})

export const duplicateNote = receive<{
  noteId: NoteId,
}>()(async ({ noteId, userId }) => {

  // Validate
  const note = await validateNoteId({ noteId, userId });

  // Create a new note with the same text as the note being duplicated
  const now = new Date();
  const noteCreated = await prisma.note.create({ data: { userId, text: note.text, dateUpdated: now, dateViewed: now } });

  // Create new note tags with the same tag ids as the note being duplicated
  const noteTagTagIds = (await prisma.noteTag.findMany({ where: { noteId }, select: { tagId: true } })).map(nt => nt.tagId);
  await prisma.noteTag.createMany({ data: noteTagTagIds.map(tagId => ({ noteId: noteCreated.id, tagId })) });

  // Populate and return response
  const noteTags = await prisma.noteTag.findMany({ where: { noteId: noteCreated.id, tagId: { in: noteTagTagIds } } });
  return { status: 'NOTE_DUPLICATED', note: noteCreated, noteTags } as const;
})

export const splitNote = receive<{
  noteId: NoteId,
  from: number,
  to: number,
}>()(async ({ from, to, noteId, userId }) => {

  // Validate
  const note = await validateNoteId({ noteId, userId });

  // Create new note with the split text
  const now = new Date();
  const noteCreated = await prisma.note.create({ data: { userId, text: note.text.slice(from, to), dateUpdated: now, dateViewed: now } });

  // Create new note tags for the new note
  const tagIdsToBeAssigned = await listUnArchivedTagIdsWithTagText({ userId, noteText: noteCreated.text });
  if (tagIdsToBeAssigned.length) {
    await prisma.noteTag.createMany({ data: tagIdsToBeAssigned.map(tagId => ({ noteId: noteCreated.id, tagId })) });
  }

  // Update the existing note by removing the split text
  const noteUpdated = await prisma.note.update({ where: { id: noteId }, data: { text: `${note.text.slice(0, from)}${note.text.slice(to)}`, dateUpdated: now, dateViewed: now } });

  // Archive note tags that are no longer associated with the existing note
  const tagIdsUpdatedForExistingNote = await listUnArchivedTagIdsWithTagText({ userId, noteText: noteUpdated.text });
  const tagIdsForExistingNote = (await prisma.noteTag.findMany({ where: { noteId }, select: { tagId: true } })).map(nt => nt.tagId as TagId);
  const tagIdsToBeUnassignedFromExistingNote = tagIdsForExistingNote.filter(tagId => !tagIdsUpdatedForExistingNote.includes(tagId));
  const idsOfNoteTagsToBeArchived = (await prisma.noteTag.findMany({ where: { noteId, tagId: { in: tagIdsToBeUnassignedFromExistingNote } }, select: { id: true } })).map(nt => nt.id as NoteTagId);
  await prisma.noteTag.updateMany({ where: { id: { in: idsOfNoteTagsToBeArchived } }, data: { isArchived: true } });

  // Populate and return response
  const archivedNoteTags = await prisma.noteTag.findMany({ where: { id: { in: idsOfNoteTagsToBeArchived } } });
  const newNoteTags = await prisma.noteTag.findMany({ where: { noteId: noteCreated.id, tagId: { in: tagIdsToBeAssigned } } });
  return { status: 'NOTE_SPLIT', notes: new Array(noteCreated, noteUpdated), noteTags: new Array(...newNoteTags, ...archivedNoteTags) } as const;
});

export const updateNote = receive<{
  noteId: NoteId,
  text: string,
}>()(async ({ noteId, userId, text }) => {

  // Validate
  await validateNoteId({ noteId, userId });

  // Update note
  const now = new Date();
  const note = await prisma.note.update({ where: { id: noteId }, data: { text, dateUpdated: now, dateViewed: now } });

  // Populate and return response
  return { status: 'NOTE_UPDATED', note } as const;
});

export const viewNote = receive<{
  noteId: NoteId
}>()(async ({ noteId, userId }) => {

  // Validate
  await validateNoteId({ noteId, userId });

  // Update note
  const note = await prisma.note.update({ where: { id: noteId }, data: { dateViewed: new Date() } });

  // Populate and return response
  return { status: 'NOTE_VIEWED', note } as const;
})

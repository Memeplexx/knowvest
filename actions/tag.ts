"use server";
import { NoteTag, Prisma } from "@prisma/client";
import { ApiError, archiveAllEntitiesAssociatedWithAnyArchivedTags, listNotesWithTagText, prisma, receive } from "./_common";
import { NoteTagDTO, TagId } from "./types";

export const createTag = receive<{
  text: string,
}>()(async ({ userId, text }) => {

  // Validate
  if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
  const unArchivedTagWithSameName = await prisma.tag.findFirst({ where: { text, userId, isArchived: false } });
  if (unArchivedTagWithSameName) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

  // Create a new synonym for the new tag to belong to
  const synonym = await prisma.synonym.create({ data: {} });

  // Create a new tag with the supplied tag text
  const tag = await prisma.tag.create({ data: { userId, text, synonymId: synonym.id } });

  // Find notes which contain the tag text and create noteTags for them
  const notesWithTag = await listNotesWithTagText({ userId, tagText: text });
  await prisma.noteTag.createMany({ data: notesWithTag.map(note => ({ noteId: note.id, tagId: tag.id })) });
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id, noteId: { in: notesWithTag.map(nwt => nwt.id) } } });

  // Populate and return response
  return { status: 'TAG_CREATED', tag, noteTags } as const;
});

export const updateTag = receive<{
  tagId: TagId,
  text: string,
}>()(async ({ userId, tagId, text }) => {

  // Validate
  if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
  const unArchivedTagToUpdate = await prisma.tag.findFirst({ where: { id: tagId, userId, isArchived: false } });
  if (!unArchivedTagToUpdate) { throw new ApiError('NOT_FOUND', 'Tag not found'); }
  if (unArchivedTagToUpdate.text === text) { return { status: 'TAG_UNCHANGED' } as const; }
  const unArchivedTagWithSameText = await prisma.tag.findFirst({ where: { text, isArchived: false } });
  if (unArchivedTagWithSameText) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

  // Archive any noteTags which are associated with notes which no longer contain the tag's old text
  const noteTagIdsToBeArchived = (await prisma.$queryRaw<NoteTag[]>(Prisma.sql`
    SELECT nt.id FROM note_tag nt 
      JOIN note n on nt.note_id = n.id 
      WHERE n.user_id = ${userId} AND n.text ~* CONCAT('\\m', ${unArchivedTagToUpdate.text}, '\\M');
  `)).map(nt => nt.id);
  await prisma.noteTag.updateMany({ where: { id: { in: noteTagIdsToBeArchived } }, data: { isArchived: true } });
  const archivedNoteTags = await prisma.noteTag.findMany({ where: { id: { in: noteTagIdsToBeArchived } } });

  // Find notes which contain the tag text and create noteTags for them
  const notesWhichNeedNoteTagsCreated = await listNotesWithTagText({ userId, tagText: text });
  await prisma.noteTag.createMany({ data: notesWhichNeedNoteTagsCreated.map(note => ({ noteId: note.id, tagId })) });
  const newNoteTags = await prisma.noteTag.findMany({ where: { tagId, noteId: { in: notesWhichNeedNoteTagsCreated.map(nwt => nwt.id) } } });

  // Update the tag text
  const tag = await prisma.tag.update({ where: { id: tagId }, data: { text } });

  // Populate and return response
  return { status: 'TAG_UPDATED', tag, noteTags: [...newNoteTags, ...archivedNoteTags] as NoteTagDTO[] } as const;
});

export const archiveTag = receive<{
  tagId: TagId,
}>()(async ({ tagId, userId }) => {

  // Validate
  const unArchivedTag = await prisma.tag.findFirst({ where: { id: tagId, isArchived: false } });
  if (!unArchivedTag) { throw new ApiError('NOT_FOUND', 'Tag not found'); }

  // Archive the tag
  const tag = await prisma.tag.update({ where: { id: tagId }, data: { isArchived: true } });

  // Archive any synonyms and synonym groups that are now orphaned
  const archivedEntities = await archiveAllEntitiesAssociatedWithAnyArchivedTags(userId);

  // Populate and return response
  return { status: 'TAG_ARCHIVED', tag, ...archivedEntities } as const;
});

export const createTagFromActiveNote = receive<{
  tagText: string,
}>()(async ({ userId, tagText }) => {

  // Validate
  if (!tagText.trim().length) { return { status: 'BAD_REQUEST', fields: { tagText: 'Tag name cannot be empty' } } as const; }
  const unArchivedTagWithSameName = await prisma.tag.findFirst({ where: { text: tagText, userId, isArchived: false } });
  if (unArchivedTagWithSameName) { return { status: 'CONFLICT', fields: { tagText: 'A tag with this name already exists.' } } as const; }

  // Create a new synonym for the new tag to belong to
  const synonym = await prisma.synonym.create({ data: {} });

  // Create a new tag with the supplied tag text
  const tag = await prisma.tag.create({ data: { synonymId: synonym.id, text: tagText, userId } });

  // Find notes which contain the tag text and create noteTags for them
  const notesWithThisTagText = await listNotesWithTagText({ userId, tagText });
  await prisma.noteTag.createMany({ data: notesWithThisTagText.map(note => ({ noteId: note.id, tagId: tag.id })) })

  // Populate and return response
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id } });
  return { status: 'CREATED', tag, noteTags } as const;
});

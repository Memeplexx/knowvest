"use server";
import { archiveAllEntitiesAssociatedWithAnyArchivedTags, listUnArchivedNotesWithTagText, prisma, receive } from "./_common";
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
  const noteIdsWithTag = (await listUnArchivedNotesWithTagText({ userId, tagText: text })).map(n => n.id);
  if (noteIdsWithTag.length) {
    await prisma.noteTag.createMany({ data: noteIdsWithTag.map(noteId => ({ noteId, tagId: tag.id })) });
  }
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id, noteId: { in: noteIdsWithTag } } });

  // Populate and return response
  return { status: 'TAG_CREATED', tag, noteTags } as const;
});

export const updateTag = receive<{
  tagId: TagId,
  text: string,
}>()(async ({ userId, tagId, text, tag }) => {

  // Validate
  if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
  if (tag.text === text) { return { status: 'TAG_UNCHANGED' } as const; }
  const unArchivedTagWithSameText = await prisma.tag.findFirst({ where: { text, isArchived: false } });
  if (unArchivedTagWithSameText) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

  // Archive any noteTags which are associated with notes which no longer contain the tag's old text
  const noteIdsWhichContainOldTagText = (await listUnArchivedNotesWithTagText({ userId, tagText: tag.text })).map(n => n.id);
  if (noteIdsWhichContainOldTagText.length) {
    await prisma.noteTag.updateMany({ where: { noteId: { in: noteIdsWhichContainOldTagText }, tagId }, data: { isArchived: true } });
  }
  const archivedNoteTags = await prisma.noteTag.findMany({ where: { noteId: { in: noteIdsWhichContainOldTagText } } });

  // Find notes which contain the tag text and create noteTags for them
  const noteIdsWhichNeedNoteTagsCreated = (await listUnArchivedNotesWithTagText({ userId, tagText: text })).map(n => n.id);
  if (noteIdsWhichNeedNoteTagsCreated.length) {
    await prisma.noteTag.createMany({ data: noteIdsWhichNeedNoteTagsCreated.map(noteId => ({ noteId, tagId })) });  
  }
  const createdNoteTags = await prisma.noteTag.findMany({ where: { tagId, noteId: { in: noteIdsWhichNeedNoteTagsCreated } } });

  // Update the tag text
  const tagUpdated = await prisma.tag.update({ where: { id: tagId }, data: { text } });

  // Populate and return response
  return { status: 'TAG_UPDATED', tag: tagUpdated, noteTags: [...createdNoteTags, ...archivedNoteTags] as NoteTagDTO[] } as const;
});

export const archiveTag = receive<{
  tagId: TagId,
}>()(async ({ tagId, userId }) => {

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
  const noteIdsWithThisTagText = (await listUnArchivedNotesWithTagText({ userId, tagText })).map(n => n.id);
  if (noteIdsWithThisTagText.length) {
    await prisma.noteTag.createMany({ data: noteIdsWithThisTagText.map(noteId => ({ noteId, tagId: tag.id })) });
  }
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id } });

  // Populate and return response
  return { status: 'CREATED', tag, noteTags } as const;
});

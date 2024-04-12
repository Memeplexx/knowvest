"use server";
import { NoteTag } from "@prisma/client";
import { archiveNoteTagsAssociatedWithAnyArchivedTags, archiveSynonymGroupsAssociatedWithAnyArchivedTags, archiveSynonymsAssociatedWithAnyArchivedTags, getUserId, listUnArchivedNoteIdsWithTagText, prisma, respond, validateTagId } from "./_common";
import { TagId } from "./types";


export const createTag = (text: string) => respond(async () => {

  // Validate
  const userId = await getUserId();
  if (!text.trim().length) 
    return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const;
  if (await prisma.tag.findFirst({ where: { text, userId, isArchived: false } })) 
    return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const;

  // Create a new synonym for the new tag to belong to
  const synonym = await prisma.synonym.create({ data: {} });

  // Create a new tag with the supplied tag text
  const tag = await prisma.tag.create({ data: { userId, text, synonymId: synonym.id } });

  // Find notes which contain the tag text and create noteTags for them
  const noteIdsWithTag = await listUnArchivedNoteIdsWithTagText({ userId, tagText: text });
  if (noteIdsWithTag.length)
    await prisma.noteTag.createMany({ data: noteIdsWithTag.map(noteId => ({ noteId, tagId: tag.id })) });
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id, noteId: { in: noteIdsWithTag } } });

  // Populate and return response
  return { status: 'TAG_CREATED', tag, noteTags } as const;
});

export const updateTag = (tagId: TagId, text: string) => respond(async () => {

  // Validate
  const userId = await getUserId();
  const tag = await validateTagId(tagId);
  if (!text.trim().length) 
    return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const;
  if (tag.text === text) 
    return { status: 'TAG_UNCHANGED' } as const;
  if (await prisma.tag.findFirst({ where: { text, isArchived: false } })) 
    return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const;

  // Archive any noteTags which are associated with notes which no longer contain the tag's old text
  const noteIdsWhichContainOldTagText = await listUnArchivedNoteIdsWithTagText({ userId, tagText: tag.text });
  if (noteIdsWhichContainOldTagText.length)
    await prisma.noteTag.updateMany({ where: { noteId: { in: noteIdsWhichContainOldTagText }, tagId }, data: { isArchived: true } });
  const archivedNoteTags = await prisma.noteTag.findMany({ where: { noteId: { in: noteIdsWhichContainOldTagText } } });

  // Find notes which contain the tag text and create noteTags for them
  const noteIdsWhichNeedNoteTagsCreated = await listUnArchivedNoteIdsWithTagText({ userId, tagText: text });
  if (noteIdsWhichNeedNoteTagsCreated.length)
    await prisma.noteTag.createMany({ data: noteIdsWhichNeedNoteTagsCreated.map(noteId => ({ noteId, tagId })) });  
  const createdNoteTags = await prisma.noteTag.findMany({ where: { tagId, noteId: { in: noteIdsWhichNeedNoteTagsCreated } } });

  // Update the tag text
  const tagUpdated = await prisma.tag.update({ where: { id: tagId }, data: { text } });

  // Populate and return response
  return { status: 'TAG_UPDATED', tag: tagUpdated, noteTags: [...createdNoteTags, ...archivedNoteTags] as NoteTag[] } as const;
});

export const archiveTag = (tagId: TagId) => respond(async () => {

  // Validate
  await validateTagId(tagId);
  const userId = await getUserId();

  // Archive the tag
  const tag = await prisma.tag.update({ where: { id: tagId }, data: { isArchived: true } });

  // Archive any synonyms and synonym groups that are now orphaned
  const synonyms = await archiveSynonymsAssociatedWithAnyArchivedTags(userId);
  const synonymGroups = await archiveSynonymGroupsAssociatedWithAnyArchivedTags(userId);
  const noteTags = await archiveNoteTagsAssociatedWithAnyArchivedTags(userId);

  // Populate and return response
  return { status: 'TAG_ARCHIVED', tag, synonyms, synonymGroups, noteTags } as const;
});

export const createTagFromActiveNote = (tagText: string) => respond(async () => {

  // Validate
  const userId = await getUserId();
  if (!tagText.trim().length) 
    return { status: 'BAD_REQUEST', fields: { tagText: 'Tag name cannot be empty' } } as const;
  if (await prisma.tag.findFirst({ where: { text: tagText, userId, isArchived: false } })) 
    return { status: 'CONFLICT', fields: { tagText: 'A tag with this name already exists.' } } as const;

  // Create a new synonym for the new tag to belong to
  const synonym = await prisma.synonym.create({ data: {} });

  // Create a new tag with the supplied tag text
  const tag = await prisma.tag.create({ data: { synonymId: synonym.id, text: tagText, userId } });

  // Find notes which contain the tag text and create noteTags for them
  const noteIdsWithThisTagText = await listUnArchivedNoteIdsWithTagText({ userId, tagText });
  if (noteIdsWithThisTagText.length)
    await prisma.noteTag.createMany({ data: noteIdsWithThisTagText.map(noteId => ({ noteId, tagId: tag.id })) });
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id } });

  // Populate and return response
  return { status: 'CREATED', tag, noteTags } as const;
});

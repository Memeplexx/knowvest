"use server";
import { archiveSynonymGroupsAssociatedWithAnyArchivedTags, archiveSynonymsAssociatedWithAnyArchivedTags, getUserId, prisma, respond, validateTagId } from "./_common";
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
  const now = new Date();
  const tag = await prisma.tag.create({ data: { userId, text, synonymId: synonym.id, dateCreated: now } });

  // Populate and return response
  return { status: 'TAG_CREATED', tag } as const;
});

export const updateTag = (tagId: TagId, text: string) => respond(async () => {

  // Validate
  const tag = await validateTagId(tagId);
  if (!text.trim().length)
    return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const;
  if (tag.text === text)
    return { status: 'TAG_UNCHANGED' } as const;
  if (await prisma.tag.findFirst({ where: { text, isArchived: false } }))
    return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const;

  // Update the tag text
  const tagUpdated = await prisma.tag.update({ where: { id: tagId }, data: { text } });

  // Populate and return response
  return { status: 'TAG_UPDATED', tag: tagUpdated } as const;
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

  // Populate and return response
  return { status: 'TAG_ARCHIVED', tag, synonyms, synonymGroups } as const;
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
  const now = new Date();
  const tag = await prisma.tag.create({ data: { synonymId: synonym.id, text: tagText, userId, dateCreated: now } });

  // Populate and return response
  return { status: 'CREATED', tag } as const;
});

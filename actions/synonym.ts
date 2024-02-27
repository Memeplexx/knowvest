"use server";
import { archiveAllEntitiesAssociatedWithAnyArchivedTags, listUnArchivedNoteIdsWithTagText, prisma, receive, validateSynonymId, validateTagId } from './_common';
import { SynonymId, TagId } from './types';


export const removeTagFromItsCurrentSynonym = receive<{
  tagId: TagId,
}>()(async ({ userId, tagId }) => {

  // Validate
  await validateTagId({ tagId, userId });

  // Create a new synonym and assign the tag to it
  const synonym = await prisma.synonym.create({ data: {} });
  const tag = await prisma.tag.update({ where: { id: tagId }, data: { synonymId: synonym.id } });

  // Archive any synonyms and synonym groups that are now orphaned
  const archivedEntities = await archiveAllEntitiesAssociatedWithAnyArchivedTags(userId);

  // Populate and return response
  return { status: 'TAG_MOVED_TO_NEW_SYNONYM', tag, ...archivedEntities } as const;
});

export const addTagToSynonym = receive<{
  tagId: TagId,
  synonymId: SynonymId,
}>()(async ({ userId, synonymId, tagId }) => {

  // Validate
  const tag = await validateTagId({ tagId, userId });
  await validateSynonymId({ synonymId, userId });

  // Find all tags that are currently associated with the same synonym as the tag to be updated
  const allTagIdsAssociatedWithOldSynonym = (await prisma.tag.findMany({ where: { synonymId: tag.synonymId }, select: { id: true } })).map(t => t.id as TagId);

  // Update the above tags to be associated with the new synonym
  await prisma.tag.updateMany({ where: { id: { in: allTagIdsAssociatedWithOldSynonym } }, data: { synonymId } });

  // Archive any synonyms and synonym groups that are now orphaned
  const archivedEntities = await archiveAllEntitiesAssociatedWithAnyArchivedTags(userId);

  // Populate and return response
  const tags = await prisma.tag.findMany({ where: { id: { in: allTagIdsAssociatedWithOldSynonym } } });
  return { status: 'TAGS_UPDATED', tags, ...archivedEntities } as const;
});

export const createTagForSynonym = receive<{
  text: string,
  synonymId?: SynonymId,
}>()(async ({ userId, synonymId, text }) => {

  // Validate
  !!synonymId && await validateSynonymId({ synonymId, userId });
  if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
  const tagWithSameText = await prisma.tag.findFirst({ where: { text, userId, isArchived: false } });
  if (tagWithSameText) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

  // Either create a new synonym if the synonymId is null, else find the existing synonym
  const synonym = !synonymId
    ? await prisma.synonym.create({ data: {} })
    : await prisma.synonym.findFirstOrThrow({ where: { id: synonymId } });

  // Create new tag
  const tag = await prisma.tag.create({ data: { text, synonymId: synonym.id, userId } });

  // Create new note tags
  const noteIdsWithTagText = await listUnArchivedNoteIdsWithTagText({ userId, tagText: text });
  if (noteIdsWithTagText.length) {
    await prisma.noteTag.createMany({ data: noteIdsWithTagText.map(noteId => ({ noteId, tagId: tag.id }))});
  }
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id } });

  // Populate and return response
  return { status: 'TAG_CREATED', tag, noteTags } as const;
});

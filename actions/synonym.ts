"use server";
import { archiveSynonymGroupsAssociatedWithAnyArchivedTags, archiveSynonymsAssociatedWithAnyArchivedTags, getUserId, prisma, respond, validateSynonymId, validateTagId } from './_common';
import { SynonymId, TagId } from './types';


export const removeTagFromItsCurrentSynonym = (tagId: TagId) => respond(async () => {

  // Validate
  await validateTagId(tagId);
  const userId = await getUserId();

  // Create a new synonym and assign the tag to it
  const synonym = await prisma.synonym.create({ data: {} });
  const tag = await prisma.tag.update({ where: { id: tagId }, data: { synonymId: synonym.id } });

  // Archive any synonyms and synonym groups that are now orphaned
  const synonyms = await archiveSynonymsAssociatedWithAnyArchivedTags(userId);
  const synonymGroups = await archiveSynonymGroupsAssociatedWithAnyArchivedTags(userId);

  // Populate and return response
  return { status: 'TAG_MOVED_TO_NEW_SYNONYM', tag, synonyms, synonymGroups } as const;
});

export const addTagToSynonym = (synonymId: SynonymId, tagId: TagId) => respond(async () => {

  // Validate
  const userId = await getUserId();
  const tag = await validateTagId(tagId);
  await validateSynonymId(synonymId);

  // Find all tags that are currently associated with the same synonym as the tag to be updated
  const allTagIdsAssociatedWithOldSynonym = (await prisma.tag.findMany({ where: { synonymId: tag.synonymId }, select: { id: true } })).map(t => t.id as TagId);

  // Update the above tags to be associated with the new synonym
  await prisma.tag.updateMany({ where: { id: { in: allTagIdsAssociatedWithOldSynonym } }, data: { synonymId } });

  // Archive any synonyms and synonym groups that are now orphaned
  const synonyms = await archiveSynonymsAssociatedWithAnyArchivedTags(userId);
  const synonymGroups = await archiveSynonymGroupsAssociatedWithAnyArchivedTags(userId);

  // Populate and return response
  const tags = await prisma.tag.findMany({ where: { id: { in: allTagIdsAssociatedWithOldSynonym } } });
  return { status: 'TAGS_UPDATED', tags, synonyms, synonymGroups } as const;
});

export const createTagForSynonym = (text: string, synonymId?: SynonymId) => respond(async () => {

  // Validate
  const userId = await getUserId();
  !!synonymId && await validateSynonymId(synonymId);
  if (!text.trim())
    return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const;
  if (await prisma.tag.findFirst({ where: { text, userId, isArchived: false } }))
    return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const;

  // Either create a new synonym if the synonymId is null, else find the existing synonym
  const synonym = !synonymId
    ? await prisma.synonym.create({ data: {} })
    : await prisma.synonym.findFirstOrThrow({ where: { id: synonymId } });

  // Create new tag
  const now = new Date();
  const tag = await prisma.tag.create({ data: { text, synonymId: synonym.id, userId, dateCreated: now } });

  // Populate and return response
  return { status: 'TAG_CREATED', tag } as const;
});

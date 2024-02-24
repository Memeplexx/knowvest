"use server";
import { archiveAllEntitiesAssociatedWithAnyArchivedTags, listNotesWithTagText, prisma, receive } from './_common';
import { SynonymId, TagId } from './types';


export const removeTagFromItsCurrentSynonym = receive<{
  tagId: TagId,
}>()(async ({ userId, tagId }) => {

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
}>()(async ({ userId, synonymId, tag }) => {

  // Find all tags that are currently associated with the same synonym as the tag to be updated
  const allTagsAssociatedWithOldSynonym = await prisma.tag.findMany({ where: { synonymId: tag.synonymId } });
  const allTagIdsAssociatedWithOldSynonym = allTagsAssociatedWithOldSynonym.map(tag => tag.id);

  // Update the above tags to be associated with the new synonym
  await prisma.tag.updateMany({ where: { id: { in: allTagIdsAssociatedWithOldSynonym } }, data: { synonymId } });

  // Archive any synonyms and synonym groups that are now orphaned
  const archivedEntities = await archiveAllEntitiesAssociatedWithAnyArchivedTags(userId);

  // Populate and return response
  const tags = await prisma.tag.findMany({ where: { id: { in: allTagIdsAssociatedWithOldSynonym } } });
  return { status: 'TAGS_UPDATED', tags, ...archivedEntities } as const;
});

export const createTagToSynonym = receive<{
  text: string,
  synonymId?: SynonymId,
}>()(async ({ userId, synonymId, text }) => {

  // Validate
  if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
  const tagWithSameText = await prisma.tag.findFirst({ where: { text, userId } });
  if (tagWithSameText) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

  // Either create a new synonym if the synonymId is null, else find the existing synonym
  const synonym = !synonymId
    ? await prisma.synonym.create({ data: {} })
    : await prisma.synonym.findFirstOrThrow({ where: { id: synonymId } });

  // Try to find a tag with the same text
  const tagAlreadyCreated = await prisma.tag.findFirst({ where: { text, userId } });
  if (tagAlreadyCreated) {

    // If a was found, update it to be associated with the new synonym
    await prisma.tag.update({ where: { id: tagAlreadyCreated.id }, data: { synonymId: synonym.id } });
  } else {

    // Else create a new tag assigned to the new synonym
    await prisma.tag.create({ data: { text, synonymId: synonym.id, userId } });
  }
  const tag = await prisma.tag.findFirstOrThrow({ where: { text, userId, synonymId: synonym.id } });

  // Unarchived note tags that have the same text as the new tag
  const notesWithTagText = await listNotesWithTagText({ userId, tagText: text });
  const noteIdsWithTagText = notesWithTagText.map(note => note.id);
  const noteTagsAlreadyCreated = await prisma.noteTag.findMany({ where: { noteId: { in: noteIdsWithTagText }, tagId: tag.id, isArchived: true } });
  const idsOfNoteTagsAlreadyCreated = noteTagsAlreadyCreated.map(nt => nt.id);
  if (noteTagsAlreadyCreated.length) {
    await prisma.noteTag.updateMany({ where: { id: { in: idsOfNoteTagsAlreadyCreated } }, data: { isArchived: false } });
  }

  // Create new note tags for any notes that don't already have one
  const idsOfNotesToBeCreated = noteIdsWithTagText.filter(noteId => !idsOfNoteTagsAlreadyCreated.includes(noteId));
  if (idsOfNotesToBeCreated.length) {
    await prisma.noteTag.createMany({ data: idsOfNotesToBeCreated.map(noteId => ({ noteId, tagId: tag.id })) });
  }

  // Populate and return response
  const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id } });
  return { status: 'TAG_CREATED', tag, noteTags } as const;
});

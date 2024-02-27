"use server";
import { prisma, receive, validateTagId } from './_common';
import { NoteId, TagId } from './types';


export const updateNoteTags = receive<{
  noteId: NoteId,
  addTagIds: TagId[],
  removeTagIds: TagId[],
}>()(async ({ userId, addTagIds, noteId, removeTagIds }) => {

  // Validation
  await [...addTagIds, ...removeTagIds].map(async tagId => await validateTagId({ tagId, userId }));

  // If there are any tags to be added...
  if (addTagIds.length) {

    // ... and if there are any existing archived note tags, then unarchive them
    const existingNoteTags = await prisma.noteTag.findMany({ where: { noteId, tagId: { in: addTagIds } }, select: { tagId: true, id: true } });
    if (existingNoteTags.length) {
      await prisma.noteTag.updateMany({ where: { id: { in: existingNoteTags.map(noteTag => noteTag.id) } }, data: { isArchived: false } });
    }
    
    // ... and if there are any tags that need to be created, then create them
    if (existingNoteTags.length < addTagIds.length) {
      const tagIdsOfNoteTagsJustCreated = existingNoteTags.map(noteTag => noteTag.tagId);
      const tagIdsOfNoteTagsToBeCreated = addTagIds.filter(tagId => !tagIdsOfNoteTagsJustCreated.includes(tagId));
      await prisma.noteTag.createMany({ data: tagIdsOfNoteTagsToBeCreated.map(tagId => ({ tagId, noteId })) });
    }
  }

  // If there are any tags to be archived, then archive them
  if (removeTagIds.length) {
    await prisma.noteTag.updateMany({ where: { noteId, tagId: { in: removeTagIds } }, data: { isArchived: true } });
  }

  // Populate and return response
  const noteTags = await prisma.noteTag.findMany({ where: { noteId } });
  return { status: 'NOTE TAGS UPDATED', noteTags };
});


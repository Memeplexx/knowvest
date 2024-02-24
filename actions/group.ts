"use server";
import { ApiError, listNotesWithTagText, prisma, receive } from './_common';
import { GroupId, SynonymId } from './types';


export const createGroup = receive<{
  name: string,
  synonymId: SynonymId,
}>()(async ({ userId, name, synonymId }) => {

  // Validation
  if (!name.trim().length) { return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const; }
  const groupWithSameName = await prisma.group.findFirst({ where: { name, userId } });
  if (groupWithSameName) { throw new ApiError('CONFLICT', 'A group with this name already exists.'); }

  // Logic
  const group = await prisma.group.create({ data: { name, userId } });
  const synonymGroup = !synonymId ? null : await prisma.synonymGroup.create({ data: { groupId: group.id, synonymId } });
  return { status: 'GROUP_CREATED', group, synonymGroup } as const;
});

export const updateGroup = receive<{
  groupId: GroupId,
  name: string,
}>()(async ({ userId, groupId, name }) => {

  // Validation
  if (!name.trim().length) { return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const; }
  const anotherGroupWithSameName = await prisma.group.findFirst({ where: { name, userId, id: { not: groupId } } });
  if (anotherGroupWithSameName) { return { status: 'CONFLICT', message: 'A group with this name already exists.' } as const; }

  // logic
  const group = await prisma.group.update({ where: { id: groupId }, data: { name } });
  return { status: 'GROUP_UPDATED', group } as const;
});

export const archiveGroup = receive<{
  groupId: GroupId
}>()(async ({ groupId }) => {

  // Logic
  const synonymGroups = await prisma.synonymGroup.findMany({ where: { groupId } });
  await prisma.synonymGroup.updateMany({ where: { groupId }, data: { isArchived: true } });
  const group = await prisma.group.update({ where: { id: groupId }, data: { isArchived: true } });
  return { status: 'ARCHIVED', group, synonymGroups } as const;
});

export const removeSynonymFromGroup = receive<{
  synonymId: SynonymId,
  groupId: GroupId,
}>()(async ({ groupId, synonymId }) => {

  // Update synonym groups
  const synonymGroupsToBeArchived = await prisma.synonymGroup.findMany({ where: { synonymId, groupId } });
  const idsOfSynonymGroupsToBeArchived = synonymGroupsToBeArchived.map(sg => sg.id);
  await prisma.synonymGroup.updateMany({ where: { id: { in: idsOfSynonymGroupsToBeArchived } }, data: { isArchived: true } });

  // Populate and return response
  const synonymGroups = await prisma.synonymGroup.findMany({ where: { id: { in: idsOfSynonymGroupsToBeArchived } } });
  const groupSynonymGroups = await prisma.synonymGroup.findMany({ where: { groupId } });
  const group = !groupSynonymGroups.length ? await prisma.group.update({ where: { id: groupId }, data: { isArchived: true } }) : null;
  return { status: 'SYNONYM_REMOVED_FROM_GROUP', synonymGroups, group } as const;
});

export const addSynonymToGroup = receive<{
  synonymId: SynonymId,
  groupId: GroupId,
}>()(async ({ groupId, synonymId }) => {

  // Logic
  const existingSynonymGroup = await prisma.synonymGroup.findFirst({ where: { synonymId, groupId } });
  if (existingSynonymGroup) {
    await prisma.synonymGroup.update({ where: { id: existingSynonymGroup.id }, data: { isArchived: false } })
  } else {
    await prisma.synonymGroup.create({ data: { groupId, synonymId } });
  }

  // Populate and return response
  const synonymGroup = await prisma.synonymGroup.findFirstOrThrow({ where: { groupId, synonymId } });
  return { status: 'SYNONYM_ADDED_TO_GROUP', synonymGroup } as const;
});

export const createTagForGroup = receive<{
  text: string,
  groupId: GroupId,
  synonymId: SynonymId,
}>()(async ({ groupId, synonymId, text, userId }) => {

  // Validation
  if (!text.trim()) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
  const tagWithSameName = await prisma.tag.findFirst({ where: { text, userId, isArchived: false } });
  if (tagWithSameName) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

  // If a tag with the same text exists then un archive it, otherwise create a new tag
  const tagAlreadyCreated = await prisma.tag.findFirst({ where: { text, userId } });
  if (tagAlreadyCreated) {
    await prisma.tag.update({ where: { id: tagAlreadyCreated.id }, data: { isArchived: false } });
  } else {
    await prisma.tag.create({ data: { text, synonymId, userId } });
  }
  const tag = await prisma.tag.findFirstOrThrow({ where: { text, userId, synonymId } });

  // If a synonym group with the same groupId and synonymId already exists then un archive it, otherwise create a new synonym group
  const synonymGroupAlreadyCreated = await prisma.synonymGroup.findFirst({ where: { groupId, synonymId } });
  if (synonymGroupAlreadyCreated) {
    await prisma.synonymGroup.update({ where: { id: synonymGroupAlreadyCreated.id }, data: { isArchived: false } });
  } else {
    await prisma.synonymGroup.create({ data: { groupId, synonymId } });
  }

  // Finds all notes that contain the tag text, then...
  const notesWithTagText = await listNotesWithTagText({ userId, tagText: text });
  const noteIdsWithTagText = notesWithTagText.map(note => note.id);

  // ... If any of the note tags already exist then un archive them, otherwise create new note tags
  const noteTagsAlreadyCreated = await prisma.noteTag.findMany({ where: { noteId: { in: noteIdsWithTagText }, tag: { text } } });
  const idsOfNoteTagsAlreadyCreated = noteTagsAlreadyCreated.map(nt => nt.id);
  if (noteTagsAlreadyCreated.length) {
    await prisma.noteTag.updateMany({ where: { id: { in: idsOfNoteTagsAlreadyCreated } }, data: { isArchived: false } });
  }

  // ... If any new note tags need to be created then create them
  const newNoteTagsToBeCreated = notesWithTagText.filter(nt => !idsOfNoteTagsAlreadyCreated.includes(nt.id));
  if (newNoteTagsToBeCreated.length) {
    await prisma.noteTag.createMany({ data: newNoteTagsToBeCreated.map(note => ({ noteId: note.id, tagId: tag.id })) });
  }

  // Populate and return response
  const synonymGroup = await prisma.synonymGroup.findFirstOrThrow({ where: { groupId, synonymId } });
  const noteTags = await prisma.noteTag.findMany({ where: { noteId: { in: noteIdsWithTagText } } });
  return { status: 'TAG_CREATED', tag, noteTags, synonymGroup } as const;
});


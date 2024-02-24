"use server";
import { string } from 'zod';
import { ApiError, receive, listNotesWithTagText, prisma, groupId, synonymId } from './_common';


export const createGroup = receive({
  name: string(),
  synonymId: synonymId().optional(),
}).then(async ({ userId, name, synonymId }) => {

  // Validation
  if (!name.trim().length) { return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const; }
  const groupWithSameName = await prisma.group.findFirst({ where: { name, userId } });
  if (groupWithSameName) { throw new ApiError('CONFLICT', 'A group with this name already exists.'); }

  // Logic
  const group = await prisma.group.create({ data: { name, userId } });
  const synonymGroup = !synonymId ? null : await prisma.synonymGroup.create({ data: { groupId: group.id, synonymId } });
  return { status: 'GROUP_CREATED', group, synonymGroup } as const;
});

export const updateGroup = receive({
  groupId: groupId(),
  name: string(),
}).then(async ({ userId, groupId, name }) => {

  // Validation
  const groupToUpdate = await prisma.group.findFirst({ where: { id: groupId } });
  if (!groupToUpdate) { throw new ApiError('NOT_FOUND', 'Group not found'); }
  if (!name.trim().length) { return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const; }
  const anotherGroupWithSameName = await prisma.group.findFirst({ where: { name, userId, id: { not: groupId } } });
  if (anotherGroupWithSameName) { return { status: 'CONFLICT', message: 'A group with this name already exists.' } as const; }

  // logic
  const group = await prisma.group.update({ where: { id: groupId }, data: { name } });
  return { status: 'GROUP_UPDATED', group } as const;
});

export const archiveGroup = receive({
  groupId: groupId(),
}).then(async ({ groupId }) => {

  // Validation
  const groupToArchive = await prisma.group.findFirst({ where: { id: groupId } });
  if (!groupToArchive) { throw new ApiError('NOT_FOUND', 'Group not found'); }

  // Logic
  const synonymGroups = await prisma.synonymGroup.findMany({ where: { groupId } });
  await prisma.synonymGroup.updateMany({ where: { groupId }, data: { isArchived: true } });
  const group = await prisma.group.update({ where: { id: groupId }, data: { isArchived: true } });
  return { status: 'ARCHIVED', group, synonymGroups } as const;
});

export const removeSynonymFromGroup = receive({
  synonymId: synonymId(),
  groupId: groupId(),
}).then(async ({ userId, groupId, synonymId }) => {

  // Validation
  const groupFromGroupId = await prisma.group.findFirst({ where: { id: groupId } });
  if (!groupFromGroupId) { throw new ApiError('NOT_FOUND', 'Group not found'); }
  const synonymToArchive = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
  if (!synonymToArchive) { throw new ApiError('NOT_FOUND', 'Synonym not found'); }

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

export const addSynonymToGroup = receive({
  synonymId: synonymId(),
  groupId: groupId(),
}).then(async ({ userId, groupId, synonymId }) => {

  // Validation
  const group = await prisma.group.findFirst({ where: { id: groupId, userId } });
  if (!group) { throw new ApiError('NOT_FOUND', 'Group not found'); }
  const synonym = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
  if (!synonym) { throw new ApiError('NOT_FOUND', 'Synonym not found'); }

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

export const createTagForGroup = receive({
  text: string(),
  groupId: groupId(),
  synonymId: synonymId(),
}).then(async ({ groupId, synonymId, text, userId }) => {

  // Validation
  const group = await prisma.group.findFirst({ where: { id: groupId, userId } });
  if (!group) { throw new ApiError('NOT_FOUND', 'Group not found'); }
  const synonym = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
  if (!synonym) { throw new ApiError('NOT_FOUND', 'Synonym not found'); }
  if (!text.trim()) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
  const tagWithSameName = await prisma.tag.findFirst({ where: { text, userId } });
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


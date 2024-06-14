"use server";
import { getUserId, prisma, respond, validateGroupId, validateSynonymId } from './_common';
import { GroupId, SynonymGroupId, SynonymId } from './types';


export const createGroup = (name: string, synonymId: SynonymId) => respond(async () => {

  // Validate
  await validateSynonymId(synonymId);
  const userId = await getUserId();
  if (!name.trim())
    return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const;
  if (await prisma.group.findFirst({ where: { name, userId, isArchived: false } }))
    return { status: 'CONFLICT', message: 'A group with this name already exists.' } as const;

  // Check if an archived group with the same text exists and restore it if so
  const existingArchivedGroupWithSameText = await prisma.group.findFirst({ where: { name, userId, isArchived: true } });
  if (existingArchivedGroupWithSameText) {
    const group = await prisma.group.update({ where: { id: existingArchivedGroupWithSameText.id }, data: { isArchived: false } });
    const synonymGroup = await prisma.synonymGroup.create({ data: { groupId: group.id, synonymId } });
    return { status: 'GROUP_RESTORED', group, synonymGroup } as const;
  }

  // Logic
  const group = await prisma.group.create({ data: { name, userId } });
  const synonymGroup = await prisma.synonymGroup.create({ data: { groupId: group.id, synonymId } });
  return { status: 'GROUP_CREATED', group, synonymGroup } as const;
});

export const updateGroup = (groupId: GroupId, name: string) => respond(async () => {

  // Validate
  await validateGroupId(groupId);
  const userId = await getUserId();
  if (!name.trim())
    return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const;
  if (await prisma.group.findFirst({ where: { name, userId, id: { not: groupId }, isArchived: false } }))
    return { status: 'CONFLICT', message: 'A group with this name already exists.' } as const;

  // Check if an archived group with the same text exists and restore it if so
  const existingArchivedGroupWithSameText = await prisma.group.findFirst({ where: { name, userId, isArchived: true } });
  if (existingArchivedGroupWithSameText) {
    const group = await prisma.group.update({ where: { id: existingArchivedGroupWithSameText.id }, data: { isArchived: false } });
    return { status: 'GROUP_RESTORED', group } as const;
  }

  // Update group and return response
  const group = await prisma.group.update({ where: { id: groupId }, data: { name } });
  return { status: 'GROUP_UPDATED', group } as const;
});

export const archiveGroup = (groupId: GroupId) => respond(async () => {

  // Validate
  await validateGroupId(groupId);

  // Logic
  await prisma.synonymGroup.updateMany({ where: { groupId }, data: { isArchived: true } });
  const synonymGroups = await prisma.synonymGroup.findMany({ where: { groupId } });
  const group = await prisma.group.update({ where: { id: groupId }, data: { isArchived: true } });
  return { status: 'ARCHIVED', group, synonymGroups } as const;
});

export const removeSynonymFromGroup = (groupId: GroupId, synonymId: SynonymId) => respond(async () => {

  // Validate
  await validateGroupId(groupId);
  await validateSynonymId(synonymId);

  // Update synonym groups
  const idsOfSynonymGroupsToBeArchived = (await prisma.synonymGroup.findMany({ where: { synonymId, groupId }, select: { id: true } })).map(sg => sg.id as SynonymGroupId);
  await prisma.synonymGroup.updateMany({ where: { id: { in: idsOfSynonymGroupsToBeArchived } }, data: { isArchived: true } });

  // Populate and return response
  const synonymGroups = await prisma.synonymGroup.findMany({ where: { id: { in: idsOfSynonymGroupsToBeArchived } } });
  const groupSynonymGroups = await prisma.synonymGroup.findMany({ where: { groupId } });
  const group = !groupSynonymGroups.length ? await prisma.group.update({ where: { id: groupId }, data: { isArchived: true } }) : null;
  return { status: 'SYNONYM_REMOVED_FROM_GROUP', synonymGroups, group } as const;
});

export const addSynonymToGroup = (groupId: GroupId, synonymId: SynonymId) => respond(async () => {

  // Validate
  await validateGroupId(groupId);
  await validateSynonymId(synonymId);

  // Add, else create synonym group
  const synonymGroup
    = (await prisma.synonymGroup.findFirst({ where: { synonymId, groupId, isArchived: false } }))
    ?? (await prisma.synonymGroup.create({ data: { groupId, synonymId } }));

  // Populate and return response
  return { status: 'SYNONYM_ADDED_TO_GROUP', synonymGroup } as const;
});

export const createTagForGroup = (text: string, groupId: GroupId, synonymId: SynonymId) => respond(async () => {

  // Validate
  const userId = await getUserId();
  await validateGroupId(groupId);
  await validateSynonymId(synonymId);
  if (!text.trim())
    return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const;
  if (await prisma.tag.findFirst({ where: { text, userId, isArchived: false } }))
    return { status: 'CONFLICT', fields: { text: 'A tag with this name already exists.' } } as const;

  // Create a new synonym group.
  const synonymGroup = await prisma.synonymGroup.create({ data: { groupId, synonymId } });

  // Check if an archived tag with the same text exists and restore it if so
  const existingArchivedTagWithSameText = await prisma.tag.findFirst({ where: { text, userId, isArchived: true } });
  if (existingArchivedTagWithSameText) {
    const updatedTag = await prisma.tag.update({ where: { id: existingArchivedTagWithSameText.id }, data: { isArchived: false } });
    return { status: 'TAG_RESTORED', tag: updatedTag, synonymGroup } as const;
  }

  // Create a new tag.
  const now = new Date();
  const tag = await prisma.tag.create({ data: { text, synonymId, userId, dateCreated: now } });

  // Populate and return response
  return { status: 'TAG_CREATED', tag, synonymGroup } as const;
});


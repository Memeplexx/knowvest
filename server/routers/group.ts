import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodGroupId, ZodSynonymId } from '../dtos';
import { TRPCError } from '@trpc/server';
import { listNotesWithTagText } from './shared';



export const groupRouter = router({

  create: procedure
    .input(z.object({
      name: z.string(),
      synonymId: ZodSynonymId.optional(),
    }))
    .mutation(async ({ ctx: { userId }, input: { name, synonymId } }) => {

      // Validation
      if (!name.trim().length) { return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const; }
      const groupWithSameName = await prisma.group.findFirst({ where: { name, userId } });
      if (groupWithSameName) { throw new TRPCError({ code: 'CONFLICT', message: 'A group with this name already exists.' }); }

      // Logic
      const createdGroup = await prisma.group.create({ data: { name, userId } });
      const createdSynonymGroup = !synonymId ? null : await prisma.synonymGroup.create({ data: { groupId: createdGroup.id, synonymId } });
      return { status: 'GROUP_CREATED', createdGroup, createdSynonymGroup } as const;
    }),

  update: procedure
    .input(z.object({
      groupId: ZodGroupId,
      name: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { groupId, name } }) => {

      // Validation
      if (!name.trim().length) { return { status: 'BAD_REQUEST', fields: { name: 'Group name cannot be empty' } } as const; }
      const anotherGroupWithSameName = await prisma.group.findFirst({ where: { name, userId, id: { not: groupId } } });
      if (anotherGroupWithSameName) { return { status: 'CONFLICT', message: 'A group with this name already exists.' } as const; }

      // logic
      const updatedGroup = await prisma.group.update({ where: { id: groupId }, data: { name } });
      return { status: 'GROUP_UPDATED', updatedGroup } as const;
    }),

  archive: procedure
    .input(z.object({
      groupId: ZodGroupId,
    }))
    .mutation(async ({ input: { groupId } }) => {

      // Validation
      const groupToArchive = await prisma.group.findFirst({ where: { id: groupId } });
      if (!groupToArchive) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' }); }

      // Logic
      const synonymGroupsArchived = await prisma.synonymGroup.findMany({ where: { groupId } });
      await prisma.synonymGroup.updateMany({ where: { groupId }, data: { isArchived: true } });
      const groupArchived = await prisma.group.update({ where: { id: groupId }, data: { isArchived: true } });
      return { status: 'ARCHIVED', groupArchived, synonymGroupsArchived } as const;
    }),

  removeSynonym: procedure
    .input(z.object({
      synonymId: ZodSynonymId,
      groupId: ZodGroupId,
    }))
    .mutation(async ({ ctx: { userId }, input: { groupId, synonymId } }) => {

      // Validation
      const synonymToArchive = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
      if (!synonymToArchive) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Synonym not found' }); }

      // Update synonym groups
      const synonymGroupsToBeArchived = await prisma.synonymGroup.findMany({ where: { synonymId, groupId } });
      const idsOfSynonymGroupsToBeArchived = synonymGroupsToBeArchived.map(sg => sg.id);
      await prisma.synonymGroup.updateMany({ where: { id: { in: idsOfSynonymGroupsToBeArchived } }, data: { isArchived: true } });

      // Populate and return response
      const archivedSynonymGroups = await prisma.synonymGroup.findMany({ where: { id: { in: idsOfSynonymGroupsToBeArchived } } });
      const groupSynonymGroups = await prisma.synonymGroup.findMany({ where: { groupId } });
      const archivedGroup = !groupSynonymGroups.length ? await prisma.group.update({ where: { id: groupId }, data: { isArchived: true } }) : null;
      return { status: 'SYNONYM_REMOVED_FROM_GROUP', archivedSynonymGroups, archivedGroup } as const;
    }),

  addSynonym: procedure
    .input(z.object({
      synonymId: ZodSynonymId,
      groupId: ZodGroupId,
    }))
    .mutation(async ({ ctx: { userId }, input: { groupId, synonymId } }) => {

      // Validation
      const group = await prisma.group.findFirst({ where: { id: groupId, userId } });
      if (!group) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' }); }
      const synonym = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
      if (!synonym) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Synonym not found' }); }

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
    }),

  createTag: procedure
    .input(z.object({
      text: z.string(),
      groupId: ZodGroupId,
      synonymId: ZodSynonymId,
    }))
    .mutation(async ({ input: { groupId, synonymId, text }, ctx: { userId } }) => {

      // Validation
      const group = await prisma.group.findFirst({ where: { id: groupId, userId } });
      if (!group) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' }); }
      const synonym = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
      if (!synonym) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Synonym not found' }); }
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

      // ... If any of the note tags already exist then un archive them, otherwise create new note tags
      const noteTagsAlreadyCreated = await prisma.noteTag.findMany({ where: { noteId: { in: notesWithTagText.map(note => note.id) }, tag: { text } } });
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
      const noteTags = await prisma.noteTag.findMany({ where: { noteId: { in: notesWithTagText.map(note => note.id) } } });
      return { status: 'TAG_CREATED', tag, noteTags, synonymGroup } as const;
    }),
});


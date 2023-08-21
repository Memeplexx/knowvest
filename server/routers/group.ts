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
      const created = await prisma.group.create({ data: { name, userId } });
      const createdSynonymGroup = !synonymId ? null : await prisma.synonymGroup.create({ data: { groupId: created.id, synonymId } });
      return { status: 'GROUP_CREATED', created, createdSynonymGroup } as const;
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
      const updated = await prisma.group.update({ where: { id: groupId }, data: { name } });
      return { status: 'GROUP_UPDATED', updated } as const;
    }),

  delete: procedure
    .input(z.object({
      groupId: ZodGroupId,
    }))
    .mutation(async ({ input: { groupId } }) => {

      // Validation
      const groupToDelete = await prisma.group.findFirst({ where: { id: groupId } });
      if (!groupToDelete) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' }); }

      // Logic
      const synonymGroupsToDelete = await prisma.synonymGroup.findMany({ where: { groupId } });
      await prisma.synonymGroup.deleteMany({ where: { groupId } });
      const groupDeleted = await prisma.group.delete({ where: { id: groupId } });
      return { status: 'GROUP_DELETED', groupDeleted, synonymGroupsToDelete } as const;
    }),

  removeSynonym: procedure
    .input(z.object({
      synonymId: ZodSynonymId,
      groupId: ZodGroupId,
    }))
    .mutation(async ({ ctx: { userId }, input: { groupId, synonymId } }) => {

      // Validation
      const synonymToDelete = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
      if (!synonymToDelete) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Synonym not found' }); }

      // Logic
      const deletedSynonymGroup = await prisma.synonymGroup.delete({ where: { groupId_synonymId: { groupId, synonymId } } });
      const groupSynonymGroups = await prisma.synonymGroup.findMany({ where: { groupId } });
      const deletedGroup = !groupSynonymGroups.length ? await prisma.group.delete({ where: { id: groupId } }) : null;
      return { status: 'SYNONYM_REMOVED_FROM_GROUP', deletedSynonymGroup, deletedGroup } as const;
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
      const created = await prisma.synonymGroup.create({ data: { groupId, synonymId } });
      return { status: 'SYNONYM_ADDED_TO_GROUP', created } as const;
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

      // Logic
      const synonymCreated = await prisma.synonym.create({ data: {} });
      const tagCreated = await prisma.tag.create({ data: { text, synonymId: synonymCreated.id, userId } });
      const synonymGroupsCreated = [await prisma.synonymGroup.create({ data: { groupId, synonymId: synonymCreated.id } })];
      const found = await prisma.synonymGroup.findFirst({ where: { synonymId, groupId, group: { userId } } });
      if (!found) {
        synonymGroupsCreated.push(await prisma.synonymGroup.create({ data: { groupId, synonymId } }))
      }
      const notesWithTag = await listNotesWithTagText({ userId, tagText: text });
      const noteTagsCreated = await prisma.$transaction(notesWithTag.map(note => prisma.noteTag.create({ data: { noteId: note.id, tagId: tagCreated.id } })));
      return { status: 'TAG_CREATED', tagCreated, noteTagsCreated, synonymGroupsCreated } as const;
    }),
});


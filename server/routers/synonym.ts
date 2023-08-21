import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodSynonymId, ZodTagId } from '../dtos';
import { listNotesWithTagText, pruneOrphanedSynonymsAndSynonymGroups } from './shared';
import { TRPCError } from '@trpc/server';



export const synonymRouter = router({
  
  removeTagFromItsCurrentSynonym: procedure
    .input(z.object({
      tagId: ZodTagId,
    }))
    .mutation(async ({ ctx: { userId }, input: { tagId } }) => {

      // Validation
      const tag = await prisma.tag.findFirst({ where: { id: tagId, userId } });
      if (!tag) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Tag could not be found' }); }

      // Logic
      const synonym = await prisma.synonym.create({ data: {} });
      const tagUpdated = await prisma.tag.update({ where: { id: tagId }, data: { synonymId: synonym.id } });
      const { deletedSynonymGroups, deletedSynonyms } = await pruneOrphanedSynonymsAndSynonymGroups();
      return { status: 'TAG_MOVED_TO_NEW_SYNONYM', tagUpdated, deletedSynonymGroups, deletedSynonyms } as const;
    }),

  addTag: procedure
    .input(z.object({
      tagId: ZodTagId,
      synonymId: ZodSynonymId,
    }))
    .mutation(async ({ ctx: { userId }, input: { synonymId, tagId } }) => {

      // Validation
      const tagToUpdate = await prisma.tag.findFirst({ where: { id: tagId, userId } });
      if (!tagToUpdate) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Tag could not be found' }); }
      const synonym = await prisma.synonym.findFirst({ where: { id: synonymId, tag: { some: { userId } } } });
      if (!synonym) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Synonym could not be found' }); }

      // Logic
      const allTagsAssociatedWithOldSynonym = await prisma.tag.findMany({ where: { synonymId: tagToUpdate.synonymId } });
      const tagsUpdated = await prisma.$transaction(allTagsAssociatedWithOldSynonym.map(tag => prisma.tag.update({ where: { id: tag.id }, data: { synonymId } })));
      const { deletedSynonymGroups, deletedSynonyms } = await pruneOrphanedSynonymsAndSynonymGroups();
      return { status: 'TAGS_UPDATED', tagsUpdated, deletedSynonyms, deletedSynonymGroups } as const;
    }),

  createTag: procedure
    .input(z.object({
      text: z.string(),
      synonymId: ZodSynonymId.nullable(),
    }))
    .mutation(async ({ ctx: { userId }, input: { synonymId, text } }) => {

      // Validation
      if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
      const tagWithSameText = await prisma.tag.findFirst({ where: { text, userId } });
      if (tagWithSameText) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

      // Logic
      const tagCreated = await prisma.tag.create({ data: { userId, text, synonymId: synonymId || (await prisma.synonym.create({ data: {} })).id } });
      const notesWithTag = await listNotesWithTagText({ userId, tagText: text });
      const noteTagsCreated = await prisma.$transaction(notesWithTag.map(note => prisma.noteTag.create({ data: { noteId: note.id, tagId: tagCreated.id } })));
      return { status: 'TAG_CREATED', tagCreated, noteTagsCreated } as const;
    }),
});

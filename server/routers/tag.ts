import { NoteTag, Prisma } from '@prisma/client';
import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodTagId } from '../dtos';
import { listNotesWithTagText, pruneOrphanedSynonymsAndSynonymGroups } from './shared';
import { TRPCError } from '@trpc/server';


export const tagRouter = router({

  update: procedure
    .input(z.object({
      tagId: ZodTagId,
      text: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { tagId, text } }) => {

      // Validation
      if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
      const toUpdate = await prisma.tag.findFirst({ where: { id: tagId, userId } });
      if (!toUpdate) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Tag not found' }); }
      if (toUpdate.text === text) { return { status: 'TAG_UNCHANGED' } as const; }
      const tagWithSameName = await prisma.tag.findFirst({ where: { text } });
      if (tagWithSameName) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

      // Delete any noteTags which are associated with notes which no longer contain the tag's old text
      const noteTagsDeleted = await prisma.$queryRaw<NoteTag[]>(Prisma.sql`
        SELECT nt.* FROM note_tag nt 
          JOIN note n on nt.note_id = n.id 
          WHERE n.user_id = ${userId} AND n.text ~* CONCAT('\\m', ${toUpdate.text}, '\\M');
      `);
      await prisma.noteTag.deleteMany({ where: { tagId: { in: noteTagsDeleted.map(nt => nt.tagId) }, noteId: { in: noteTagsDeleted.map(nt => nt.noteId) } } });

      // Find notes which contain the tag text and create noteTags for them
      const notesWhichNeedNoteTagsCreated = await listNotesWithTagText({ userId, tagText: text });
      const noteTagsCreated = await prisma.$transaction(notesWhichNeedNoteTagsCreated.map(note => prisma.noteTag.create({ data: { noteId: note.id, tagId } })) );

      // Update the tag text
      const tagUpdated = await prisma.tag.update({ where: { id: tagId }, data: { text } });

      return { status: 'TAG_UPDATED', tagUpdated, noteTagsCreated, noteTagsDeleted } as const;
    }),

  delete: procedure
    .input(z.object({
      tagId: ZodTagId,
    }))
    .mutation(async opts => {

      // Validation
      const tag = await prisma.tag.findFirst({ where: { id: opts.input.tagId } });
      if (!tag) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Tag not found' }); }

      // Logic
      const noteTagsToBeDeleted = await prisma.noteTag.findMany({ where: { tagId: opts.input.tagId } });
      await prisma.noteTag.deleteMany({ where: { tagId: opts.input.tagId } });
      const tagDeleted = await prisma.tag.delete({ where: { id: opts.input.tagId } });
      const { deletedSynonyms, deletedSynonymGroups } = await pruneOrphanedSynonymsAndSynonymGroups();
      return { status: 'TAG_DELETED', tagDeleted, noteTagsDeleted: noteTagsToBeDeleted, deletedSynonyms, deletedSynonymGroups } as const;
    }),

  createFromActiveNote: procedure
    .input(z.object({
      tagText: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { tagText } }) => {

      // Validation
      if (!tagText.trim().length) { return { status: 'BAD_REQUEST', fields: { tagText: 'Tag name cannot be empty' } } as const; }
      const tagWithSameName = await prisma.tag.findFirst({ where: { text: tagText, userId } });
      if (tagWithSameName) { return { status: 'CONFLICT', fields: { tagText: 'A tag with this name already exists.' } } as const; }

      // Logic
      const synonym = await prisma.synonym.create({ data: {} });
      const tag = await prisma.tag.create({ data: { synonymId: synonym.id, text: tagText, userId } });
      const notesWithThisTagText = await listNotesWithTagText({ userId, tagText });
      await prisma.noteTag.createMany({ data: notesWithThisTagText.map(note => ({ noteId: note.id, tagId: tag.id })) })
      const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id } });
      return { status: 'CREATED', tag, noteTags } as const;
    }),
});

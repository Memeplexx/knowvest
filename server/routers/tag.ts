import { NoteTag, Prisma } from '@prisma/client';
import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { ZodTagId } from '../dtos';
import { listNotesWithTagText, pruneOrphanedSynonymsAndSynonymGroups } from './shared';
import { TRPCError } from '@trpc/server';


export const tagRouter = router({

  create: procedure
    .input(z.object({
      text: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { text } }) => {

      // Validate
      if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
      const tagWithSameText = await prisma.tag.findFirst({ where: { text, userId } });
      if (tagWithSameText) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

      // Create a new synonym for the new tag to belong to
      const synonym = await prisma.synonym.create({ data: {} });

      // Create a new tag with the supplied tag text
      const tag = await prisma.tag.create({ data: { userId, text, synonymId: synonym.id } });

      // Find notes which contain the tag text and create noteTags for them
      const notesWithTag = await listNotesWithTagText({ userId, tagText: text });
      await prisma.noteTag.createMany({ data: notesWithTag.map(note => ({ noteId: note.id, tagId: tag.id })) });

      // Populate and return response
      const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id, noteId: { in: notesWithTag.map(nwt => nwt.id) } } });
      return { status: 'TAG_CREATED', tag, noteTags } as const;
    }),

  update: procedure
    .input(z.object({
      tagId: ZodTagId,
      text: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { tagId, text } }) => {

      // Validate
      if (!text.trim().length) { return { status: 'BAD_REQUEST', fields: { text: 'Tag name cannot be empty' } } as const; }
      const toUpdate = await prisma.tag.findFirst({ where: { id: tagId, userId } });
      if (!toUpdate) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Tag not found' }); }
      if (toUpdate.text === text) { return { status: 'TAG_UNCHANGED' } as const; }
      const tagWithSameName = await prisma.tag.findFirst({ where: { text } });
      if (tagWithSameName) { return { status: 'BAD_REQUEST', fields: { text: 'A tag with this name already exists.' } } as const; }

      // Delete any noteTags which are associated with notes which no longer contain the tag's old text
      const noteTagsToBeArchived = await prisma.$queryRaw<NoteTag[]>(Prisma.sql`
        SELECT nt.id FROM note_tag nt 
          JOIN note n on nt.note_id = n.id 
          WHERE n.user_id = ${userId} AND n.text ~* CONCAT('\\m', ${toUpdate.text}, '\\M');
      `);
      const noteTagIdsToBeArchived = noteTagsToBeArchived.map(nt => nt.id);
      await prisma.noteTag.updateMany({ where: { id: { in: noteTagIdsToBeArchived } }, data: { isArchived: true } });

      // Find notes which contain the tag text and create noteTags for them
      const notesWhichNeedNoteTagsCreated = await listNotesWithTagText({ userId, tagText: text });
      await prisma.noteTag.createMany({ data: notesWhichNeedNoteTagsCreated.map(note => ({ noteId: note.id, tagId })) });

      // Update the tag text
      const tagUpdated = await prisma.tag.update({ where: { id: tagId }, data: { text } });

      // Populate and return response
      const noteTagsCreated = await prisma.noteTag.findMany({ where: { tagId, noteId: { in: notesWhichNeedNoteTagsCreated.map(nwt => nwt.id) } } });
      const archivedNoteTags = await prisma.noteTag.findMany({ where: { id: { in: noteTagIdsToBeArchived } } });
      return { status: 'TAG_UPDATED', tagUpdated, noteTagsCreated, archivedNoteTags } as const;
    }),

  archive: procedure
    .input(z.object({
      tagId: ZodTagId,
    }))
    .mutation(async opts => {

      // Validate
      const tag = await prisma.tag.findFirst({ where: { id: opts.input.tagId } });
      if (!tag) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Tag not found' }); }

      // Archive any noteTags associated with the tag which is about to be archived
      await prisma.noteTag.updateMany({ where: { tagId: opts.input.tagId }, data: { isArchived: true } });

      // Archive the tag
      const tagArchived = await prisma.tag.update({ where: { id: opts.input.tagId }, data: { isArchived: true } });

      // Archive any synonyms and synonym groups that are now orphaned
      const { archivedSynonyms, archivedSynonymGroups } = await pruneOrphanedSynonymsAndSynonymGroups();

      // Populate and return response
      const archivedNoteTags = await prisma.noteTag.findMany({ where: { tagId: opts.input.tagId } });
      return { status: 'TAG_ARCHIVED', tagArchived, archivedNoteTags, archivedSynonyms, archivedSynonymGroups } as const;
    }),

  createFromActiveNote: procedure
    .input(z.object({
      tagText: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { tagText } }) => {

      // Validate
      if (!tagText.trim().length) { return { status: 'BAD_REQUEST', fields: { tagText: 'Tag name cannot be empty' } } as const; }
      const tagWithSameName = await prisma.tag.findFirst({ where: { text: tagText, userId } });
      if (tagWithSameName) { return { status: 'CONFLICT', fields: { tagText: 'A tag with this name already exists.' } } as const; }

      // Create a new synonym for the new tag to belong to
      const synonym = await prisma.synonym.create({ data: {} });

      // Create a new tag with the supplied tag text
      const tag = await prisma.tag.create({ data: { synonymId: synonym.id, text: tagText, userId } });

      // Find notes which contain the tag text and create noteTags for them
      const notesWithThisTagText = await listNotesWithTagText({ userId, tagText });
      await prisma.noteTag.createMany({ data: notesWithThisTagText.map(note => ({ noteId: note.id, tagId: tag.id })) })

      // Populate and return response
      const noteTags = await prisma.noteTag.findMany({ where: { tagId: tag.id } });
      return { status: 'CREATED', tag, noteTags } as const;
    }),
});

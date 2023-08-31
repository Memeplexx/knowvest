import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';
import { NoteTagDTO, ZodNoteId } from '../dtos';
import { TRPCError } from '@trpc/server';
import { listTagsWithTagText } from './shared';


export const noteRouter = router({

  create: procedure
    .mutation(async ({ ctx: { userId } }) => {
      const now = new Date();
      return await prisma.note.create({ data: { userId, text: '', dateUpdated: now, dateViewed: now } });
    }),

  delete: procedure
    .input(z.object({
      noteId: ZodNoteId,
    }))
    .mutation(async ({ ctx: { userId }, input: { noteId } }) => {

      // Validation
      const noteToDelete = await prisma.note.findFirst({ where: { id: noteId, userId } });
      if (!noteToDelete) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found' }); }

      // Logic
      const noteTagsToDeleted = await prisma.noteTag.findMany({ where: { noteId } })
      const noteTagsDeleted = await prisma.$transaction(noteTagsToDeleted.map(nt => prisma.noteTag.delete({ where: { noteId_tagId: { noteId, tagId: nt.tagId } } })));
      const noteDeleted = await prisma.note.delete({ where: { id: noteId } });
      return { noteDeleted, noteTagsDeleted } as const;
    }),

  view: procedure
    .input(z.object({
      noteId: ZodNoteId,
    }))
    .mutation(async ({ ctx: { userId }, input: { noteId } }) => {

      // Validation
      const noteToView = await prisma.note.findFirst({ where: { id: noteId, userId } });
      if (!noteToView) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found' }); }

      // Logic
      return await prisma.note.update({ where: { id: noteId }, data: { dateViewed: new Date() } });
    }),

  update: procedure
    .input(z.object({
      noteId: ZodNoteId,
      text: z.string(),
    }))
    .mutation(async ({ ctx: { userId }, input: { noteId, text } }) => {

      // Validation
      const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
      if (!note) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found' }); }

      // Logic
      const now = new Date();
      const updatedNote = await prisma.note.update({ where: { id: noteId }, data: { text, dateUpdated: now, dateViewed: now } });
      return { status: 'NOTE_UPDATED', updatedNote } as const;
    }),

  duplicate: procedure
    .input(z.object({
      noteId: ZodNoteId,
    }))
    .mutation(async ({ ctx: { userId }, input: { noteId } }) => {

      // Logic
      const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
      if (!note) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Note not found' }); }

      // Logic
      const noteTags = await prisma.noteTag.findMany({ where: { noteId } });
      const noteCreated = await prisma.note.create({ data: { userId, text: note.text, dateUpdated: new Date(), dateViewed: new Date() } });
      const noteTagsCreated = await prisma.$transaction(noteTags.map(({ tagId }) => prisma.noteTag.create({ data: { noteId: noteCreated.id, tagId } })));
      return { status: 'NOTE_DUPLICATED', noteCreated, noteTagsCreated } as const;
    }),

  split: procedure
    .input(z.object({
      splitFromNoteId: ZodNoteId,
      from: z.number(),
      to: z.number(),
    }))
    .mutation(async ({ ctx: { userId }, input: { from, to, splitFromNoteId } }) => {

      // Validation
      const note = await prisma.note.findFirst({ where: { id: splitFromNoteId } });
      if (!note) { throw new TRPCError({ code: 'NOT_FOUND', message: 'Could not find note' }); }

      // Create new note and note tags
      const now = new Date();
      const noteCreated = await prisma.note.create({ data: { userId, text: note.text.slice(from, to), dateUpdated: now, dateViewed: now } });
      const tagsToBeAssigned = await listTagsWithTagText({ userId, noteText: noteCreated.text });
      const tagIdsToBeAssigned = tagsToBeAssigned.map(tag => tag.id);
      const noteTagsCreated = await prisma.$transaction(tagIdsToBeAssigned.map(tagId => prisma.noteTag.create({ data: { noteId: noteCreated.id, tagId } })));

      // Update existing note and note tags
      const noteUpdated = await prisma.note.update({ where: { id: splitFromNoteId }, data: { text: `${note.text.slice(0, from)}${note.text.slice(to)}`, dateUpdated: now, dateViewed: now } });
      const tagsUpdatedForExistingNote = await listTagsWithTagText({ userId, noteText: noteUpdated.text });
      const tagIdsUpdatedForExistingNote = tagsUpdatedForExistingNote.map(tag => tag.id);
      const noteTagsForExistingNote = await prisma.noteTag.findMany({ where: { noteId: splitFromNoteId } }) as NoteTagDTO[];
      const tagIdsToBeUnassignedFromExistingNote = noteTagsForExistingNote.map(noteTag => noteTag.tagId).filter(id => !tagIdsUpdatedForExistingNote.includes(id));
      const noteTagsRemoved = await prisma.$transaction(tagIdsToBeUnassignedFromExistingNote.map(tagId => prisma.noteTag.delete({ where: { noteId_tagId: { noteId: splitFromNoteId, tagId } } })));

      // Return response
      return { status: 'NOTE_SPLIT', noteCreated, noteUpdated, noteTagsCreated, noteTagsRemoved } as const;
    }),
});

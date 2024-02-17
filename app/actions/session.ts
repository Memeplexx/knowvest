"use server";
import { z } from 'zod';
import { prisma } from './_common';
import { NoteDTO, FlashCardDTO, GroupDTO, NoteTagDTO, SynonymGroupDTO, TagDTO } from '@/utils/types';



const initializeArg = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().url().nullish(),
  after: z.date().nullish(),
});

export async function initialize(arg: z.infer<typeof initializeArg>) {

  // Validate
  const { email, name, after, image } = initializeArg.parse(arg);
  const userByEmail = await prisma.user.findFirst({ where: { email } });

  // If the user doesn't exist, create a new user and their first note
  if (!userByEmail) {
    const user = await prisma.user.create({
      data: {
        email,
        image,
        name
      }
    });
    const note = await prisma.note.create({
      data: {
        userId: user.id,
        text: '# Welcome to Knowledge Harvest! ## This is your first note. Remove this text to get started ❤️',
        dateViewed: new Date(),
      }
    });
    return { status: 'USER_CREATED', notes: [note] as NoteDTO[] } as const;

  // Else if the user does exist, return their data after the specified date
  } else {
    const user = await prisma.user.update({ where: { email }, data: { email, image, name } });
    const userId = user.id;
    const dateUpdated = { gt: after || new Date(0) };
    const orderBy = { dateUpdated: 'desc' } as const;
    const notes = await prisma.note.findMany({ where: { userId, dateUpdated }, orderBy }) as NoteDTO[];
    const flashCards = await prisma.flashCard.findMany({ where: { note: { userId }, dateUpdated }, orderBy }) as FlashCardDTO[];
    const groups = await prisma.group.findMany({ where: { userId, dateUpdated }, orderBy }) as GroupDTO[];
    const noteTags = await prisma.noteTag.findMany({ where: { note: { userId }, dateUpdated }, orderBy }) as NoteTagDTO[];
    const synonymGroups = await prisma.synonymGroup.findMany({ where: { group: { userId }, dateUpdated }, orderBy }) as SynonymGroupDTO[];
    const tags = await prisma.tag.findMany({ where: { userId, dateUpdated }, orderBy }) as TagDTO[];
    return { status: 'USER_UPDATED', notes, flashCards, groups, noteTags, synonymGroups, tags } as const;
  }
}

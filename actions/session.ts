"use server";
import { prisma, respond } from './_common';


export const initialize = ({ user: { name, email, image }, after }: {
  user: {
    name: string,
    email: string,
    image: string | null,
  }
  after: {
    notes: Date | null,
    tags: Date | null,
    groups: Date | null,
    synonymGroups: Date | null,
    flashCards: Date | null,
  },
}) => respond(async () => {

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
    const now = new Date();
    const firstNote = await prisma.note.create({
      data: {
        userId: user.id,
        text: '# Welcome to Knowledge Harvest! ## This is your first note. Remove this text to get started ❤️',
        dateViewed: now,
        dateCreated: now,
      }
    });
    return { status: 'USER_CREATED', firstNote } as const;

    // Else if the user does exist, return their data after the specified date
  } else {
    const user = await prisma.user.update({ where: { email }, data: { email, image, name } });
    const userId = user.id;
    const orderBy = { dateUpdated: 'desc' } as const;
    const notes = await prisma.note.findMany({ where: { userId, dateUpdated: { gt: after.notes || new Date(0) } }, orderBy });
    const flashCards = await prisma.flashCard.findMany({ where: { note: { userId }, dateUpdated: { gt: after.flashCards || new Date(0) } }, orderBy });
    const groups = await prisma.group.findMany({ where: { userId, dateUpdated: { gt: after.groups || new Date(0) } }, orderBy });
    const synonymGroups = await prisma.synonymGroup.findMany({ where: { group: { userId }, dateUpdated: { gt: after.synonymGroups || new Date(0) } }, orderBy });
    const tags = await prisma.tag.findMany({ where: { userId, dateUpdated: { gt: after.tags || new Date(0) } }, orderBy });
    return { status: 'USER_UPDATED', notes, flashCards, groups, synonymGroups, tags } as const;
  }
});
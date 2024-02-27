"use server";
import { prisma, respond } from './_common';



export const initialize = ({ name, email, image, after }: {
  name: string,
  email: string,
  image: string | null,
  after: Date | null,
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
    const firstNote = await prisma.note.create({
      data: {
        userId: user.id,
        text: '# Welcome to Knowledge Harvest! ## This is your first note. Remove this text to get started ❤️',
        dateViewed: new Date(),
      }
    });
    return { status: 'USER_CREATED', firstNote } as const;

  // Else if the user does exist, return their data after the specified date
  } else {
    const user = await prisma.user.update({ where: { email }, data: { email, image, name } });
    const userId = user.id;
    const dateUpdated = { gt: after || new Date(0) };
    const orderBy = { dateUpdated: 'desc' } as const;
    const notes = await prisma.note.findMany({ where: { userId, dateUpdated }, orderBy });
    const flashCards = await prisma.flashCard.findMany({ where: { note: { userId }, dateUpdated }, orderBy });
    const groups = await prisma.group.findMany({ where: { userId, dateUpdated }, orderBy });
    const noteTags = await prisma.noteTag.findMany({ where: { note: { userId }, dateUpdated }, orderBy });
    const synonymGroups = await prisma.synonymGroup.findMany({ where: { group: { userId }, dateUpdated }, orderBy });
    const tags = await prisma.tag.findMany({ where: { userId, dateUpdated }, orderBy });
    return { status: 'USER_UPDATED', notes, flashCards, groups, noteTags, synonymGroups, tags } as const;
  }
});
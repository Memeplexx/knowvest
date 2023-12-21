import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';


export const sessionRouter = router({

  initialize: procedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      image: z.string().url().nullish(),
      after: z.date().nullish(),
    }))
    .mutation(async ({ input: { email, image, name, ...input } }) => {

      // Validate
      const userByEmail = await prisma.user.findFirst({ where: { email } });

      // Create or update user
      if (userByEmail) {
        await prisma.user.update({ where: { email }, data: { email, image, name } });
      } else {
        await prisma.user.create({ data: { email, image, name } });
      }
      const user = await prisma.user.findFirstOrThrow({ where: { email } });

      const fetchData = async () => {
        const userId = user.id;
        const dateUpdated = { gt: input.after || new Date(0) };
        const orderBy = { dateUpdated: 'desc' } as const;
        const notes = await prisma.note.findMany({ where: { userId, dateUpdated }, orderBy });
        const flashCards = await prisma.flashCard.findMany({ where: { note: { userId }, dateUpdated }, orderBy });
        const groups = await prisma.group.findMany({ where: { userId, dateUpdated }, orderBy });
        const noteTags = await prisma.noteTag.findMany({ where: { note: { userId }, dateUpdated }, orderBy });
        const synonymGroups = await prisma.synonymGroup.findMany({ where: { group: { userId }, dateUpdated }, orderBy });
        const tags = await prisma.tag.findMany({ where: { userId, dateUpdated }, orderBy });
        return { notes, flashCards, groups, noteTags, synonymGroups, tags };
      }

      // If this is a new user, create their first note
      if (!userByEmail) {
        const note = await prisma.note.create({
          data: {
            userId: user!.id,
            text: '# Welcome to Knowledge Harvest! ## This is your first note. Remove this text to get started ❤️',
            dateViewed: new Date(),
          }
        });
        return { status: 'SESSION_INITIALIZED_FOR_NEW_USER', user, note } as const;
      } else {
        return { status: 'SESSION_INITIALIZED', user, data: await fetchData() } as const;
      }
    }),

});

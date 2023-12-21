import { z } from 'zod';

import { procedure, router } from '../trpc';
import { prisma } from './_app';


export const sessionRouter = router({

  initialize: procedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      image: z.string().url().nullish(),
    }))
    .mutation(async ({ input: { email, image, name } }) => {

      // Validate
      const userByEmail = await prisma.user.findFirst({ where: { email } });

      // Create or update user
      if (userByEmail) {
        await prisma.user.update({ where: { email }, data: { email, image, name } });
      } else {
        await prisma.user.create({ data: { email, image, name } });
      }
      const user = await prisma.user.findFirst({ where: { email } });

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
        return { status: 'SESSION_INITIALIZED', user } as const;
      }
    }),

  fetchLatestData: procedure
    .input(z.object({
      after: z.date().nullish(),
    }))
    .query(async ({ ctx: { userId }, input: { after } }) => {

      // Logic
      const notes = !after
        ? await prisma.note.findMany({ where: { userId }, orderBy: { dateUpdated: 'desc' } })
        : await prisma.note.findMany({ where: { userId, dateUpdated: { gt: after } }, orderBy: { dateUpdated: 'desc' } });
      const flashCards = !after
        ? await prisma.flashCard.findMany({ where: { note: { userId } }, orderBy: { dateUpdated: 'desc' } })
        : await prisma.flashCard.findMany({ where: { note: { userId }, dateUpdated: { gt: after } }, orderBy: { dateUpdated: 'desc' } });
      const groups = !after
        ? await prisma.group.findMany({ where: { userId }, orderBy: { dateUpdated: 'desc' } })
        : await prisma.group.findMany({ where: { userId, dateUpdated: { gt: after } }, orderBy: { dateUpdated: 'desc' } });
      const noteTags = !after
        ? await prisma.noteTag.findMany({ where: { note: { userId } }, orderBy: { dateUpdated: 'desc' } })
        : await prisma.noteTag.findMany({ where: { note: { userId }, dateUpdated: { gt: after } }, orderBy: { dateUpdated: 'desc' } });
      const synonymGroups = !after
        ? await prisma.synonymGroup.findMany({ where: { group: { userId } }, orderBy: { dateUpdated: 'desc' } })
        : await prisma.synonymGroup.findMany({ where: { group: { userId }, dateUpdated: { gt: after } }, orderBy: { dateUpdated: 'desc' } });
      const tags = !after
        ? await prisma.tag.findMany({ where: { userId }, orderBy: { dateUpdated: 'desc' } })
        : await prisma.tag.findMany({ where: { userId, dateUpdated: { gt: after } }, orderBy: { dateUpdated: 'desc' } });

      // Populate and return response
      return { status: 'DATA', data: { notes, flashCards, groups, noteTags, synonymGroups, tags } } as const;
    }),


});

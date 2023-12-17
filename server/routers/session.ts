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
        return { status: 'SESSION_INITIALIZED', user, note } as const;
      } else {
        return { status: 'SESSION_INITIALIZED', user } as const;
      }
    }),

});

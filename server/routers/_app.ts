import { PrismaClient } from '@prisma/client';

import { router } from '../trpc';
import { noteRouter } from './note';
import { noteTagRouter } from './notetag';
import { tagRouter } from './tag';
import { synonymRouter } from './synonym';
import { groupRouter } from './group';

// TODO: consider https://github.com/prisma/prisma/issues/1983#issuecomment-620621213 to prevent hot-reloading causing too many connections
export const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

export const appRouter = router({
  tag: tagRouter,
  note: noteRouter,
  noteTag: noteTagRouter,
  synonym: synonymRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;



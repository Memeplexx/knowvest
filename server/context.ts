import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getToken } from "next-auth/jwt";
import { prisma } from './routers/_app';
import { UserId } from './dtos';

export async function createContext({
  req,
}: CreateNextContextOptions) {
  const sessionToken = await getToken({ req });
  if (!sessionToken) { throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Session Token not found' }); }
  const userFromDb = await prisma.user.findFirst({ where: { email: sessionToken.email! } });
  if (!userFromDb) { throw new Error('User not found in database') }
  return { userId: userFromDb.id as UserId };
}
export type Context = inferAsyncReturnType<typeof createContext>;
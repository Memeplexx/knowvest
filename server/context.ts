import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { decode } from "next-auth/jwt";
import { prisma } from './routers/_app';
import { UserId } from './dtos';

const secret = process.env.NEXTAUTH_SECRET!

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  const sessionToken = req.cookies['next-auth.session-token'];
  if (!sessionToken) { throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Session Token not found' }); }
  const user = await decode({ token: sessionToken, secret });
  const userFromDb = await prisma.user.findFirst({ where: { email: user!.email! } });
  if (!userFromDb) { throw new Error('User not found in database') }
  return { userId: userFromDb.id as UserId };
}
export type Context = inferAsyncReturnType<typeof createContext>;
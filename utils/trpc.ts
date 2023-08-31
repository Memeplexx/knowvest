import { TRPCLink, createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/routers/_app';
import superjson from 'superjson';
import { type TrpcReturningDtos } from './types';
import { observable } from '@trpc/server/observable';


function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const customLink: TRPCLink<AppRouter> = () => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          observer.error(err);
          console.error(err);
          if (err?.data?.code === "UNAUTHORIZED") {
            const win: Window = window;
            win.location = '/?session-expired=true';
          }
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

// export const trpcNext = createTRPCNext<AppRouter>({
//   config(opts) {
//     return {
//       transformer: superjson, // optional - adds superjson serialization
//       links: [
//         customLink,
//         httpBatchLink({
//           url: `${getBaseUrl()}/api/trpc`,
//         }),
//       ],
//     };
//   },
// });
// export const trpc = trpcNext as TrpcReturningDtos;

export const trpcReturningEntities = createTRPCProxyClient<AppRouter>({
  transformer: superjson, // optional - adds superjson serialization
  links: [
    customLink,
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
export const trpc = trpcReturningEntities as TrpcReturningDtos;


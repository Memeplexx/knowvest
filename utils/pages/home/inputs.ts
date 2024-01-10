import { useEffect, useRef } from "react";
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { HomeStore, initialState, initialTransientState } from "./constants";
import { UserDTO } from "@/server/dtos";
import { useIsMounted, useIsomorphicLayoutEffect, useNestedStore, useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";
import { indexeddb } from "@/utils/indexed-db";
import { derivations } from "@/utils/derivations";


export const useInputs = () => {

  const { store, state } = useNestedStore('home', initialState)!;

  useDataInitializer(store);

  useLogoutUserIfSessionExpired();

  useInitializeOlikDevtools();

  useHeaderExpander(store);

  return {
    store,
    ...useRecord(initialTransientState),
    ...state,
  }
}

const useInitializeOlikDevtools = () => {
  useEffect(() => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      connectOlikDevtoolsToStore({ trace: false });
    }
  }, []);
}

const useHeaderExpander = (store: HomeStore) => {
  useIsomorphicLayoutEffect(() => {
    const listener = () => {
      const { headerExpanded: headerContracted } = store.$state.home;
      if (window.innerWidth >= 1000 && headerContracted) {
        store.home.headerExpanded.$set(false);
      } else if (window.innerWidth < 1000 && !headerContracted) {
        store.home.headerExpanded.$set(true);
      }
    }
    listener();
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener);
  }, []);
}

const useLogoutUserIfSessionExpired = () => {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/?session-expired=true').catch(console.error);
    }
  }, [router, session.status]);
}

export const useDataInitializer = (store: HomeStore) => {
  const { data: session } = useSession();
  const mounted = useIsMounted();
  const initializingData = useRef(false);
  useEffect(() => {
    if (!session) { return; }
    if (!mounted) { return; }
    if (initializingData.current) { return; }
    initializingData.current = true;
    initializeData({ session, store })
      .then(() => initializingData.current = false)
      .catch(console.error);
  }, [mounted, session, store]);
}

const initializeData = async ({ session, store }: { session: Session, store: HomeStore }) => {
  await indexeddb.initialize();
  store.$patch(await indexeddb.read());
  const after = derivations.activeNotesSortedByDateViewed(store)[0]?.dateUpdated || null;
  const apiResponse = await trpc.session.initialize.mutate({ ...session.user as UserDTO, after });
  if (apiResponse.status === 'USER_CREATED') {
    return store.$patchDeep({
      notes: apiResponse.notes,
      activeNoteId: apiResponse.notes[0].id,
    });
  }
  await indexeddb.write(store, apiResponse);
  const activeNoteId = derivations.activeNotesSortedByDateViewed(store)[0].id;
  const selectedTagIds = store.$state.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
  const synonymIds = store.$state.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct();
  store.$patchDeep({
    activeNoteId,
    synonymIds,
  });
}
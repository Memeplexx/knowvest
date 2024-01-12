import { UserDTO } from "@/server/dtos";
import { useIsMounted, useIsomorphicLayoutEffect, useStore } from "@/utils/hooks";
import { indexeddb } from "@/utils/indexed-db";
import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { useEffect, useRef } from "react";
import { HomeStore, initialState } from "./constants";
import { getNotesSorted } from "@/utils/functions";


export const useInputs = () => {

  const { store, home } = useStore(initialState);

  useDataInitializer({ store });

  useLogoutUserIfSessionExpired();

  useInitializeOlikDevtools();

  useHeaderExpander(store);

  return {
    store,
    ...home,
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

export const useDataInitializer = ({ store }: { store: HomeStore }) => {
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
  const notesSorted = getNotesSorted(store.$state.notes);
  const after = notesSorted[0]?.dateUpdated || null;
  const apiResponse = await trpc.session.initialize.mutate({ ...session.user as UserDTO, after });
  if (apiResponse.status === 'USER_CREATED') {
    return store.$patchDeep({
      notes: apiResponse.notes,
      activeNoteId: apiResponse.notes[0].id,
    });
  }
  await indexeddb.write(store, apiResponse);
  const activeNoteId = notesSorted[0].id;
  const selectedTagIds = store.$state.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
  const synonymIds = store.$state.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct();
  store.$patchDeep({
    activeNoteId,
    synonymIds,
  });
}

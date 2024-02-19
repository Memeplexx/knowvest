import { useIsMounted, useIsomorphicLayoutEffect, useStore } from "@/utils/hooks";
import { indexeddb } from "@/utils/indexed-db";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { useRef } from "react";
import { HomeStore, initialState } from "./constants";
import { getNotesSorted } from "@/utils/app-utils";
import { redirect } from "next/navigation";
import { initialize } from "../../actions/session";
import { UserDTO } from "@/actions/types";


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
  useIsomorphicLayoutEffect(() => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      connectOlikDevtoolsToStore({ trace: true });
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
  const session = useSession();
  useIsomorphicLayoutEffect(() => {
    if (session.status === 'unauthenticated') {
      redirect('/?session-expired=true');
    }
  }, [session.status]);
}

export const useDataInitializer = ({ store }: { store: HomeStore }) => {
  const { data: session } = useSession();
  const mounted = useIsMounted();
  const initializingData = useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (!session) { return; }
    if (!mounted) { return; }
    if (initializingData.current) { return; }
    if (store.stateInitialized.$state) { return; }
    initializingData.current = true;
    initializeData({ session, store })
      .then(() => initializingData.current = false)
      .then(function useDataInitializerDone() { store.stateInitialized.$set(true); })
      .catch(console.error);
  }, [mounted, session, store]);
}

const initializeData = async ({ session, store }: { session: Session, store: HomeStore }) => {
  await indexeddb.initialize();
  store.$patch(await indexeddb.read());
  const notesSorted = getNotesSorted(store.$state.notes);
  const after = notesSorted[0] ? notesSorted[0].dateUpdated : null;
  const apiResponse = await initialize({ ...session.user as UserDTO, after });
  if (apiResponse.status === 'USER_CREATED') {
    return store.$patch({
      notes: [apiResponse.firstNote],
      activeNoteId: apiResponse.firstNote.id,
    });
  }
  await indexeddb.write(store, apiResponse);
  const activeNoteId = notesSorted[0].id;
  const selectedTagIds = store.noteTags.$filter.noteId.$eq(activeNoteId).tagId;
  const synonymIds = store.tags.$filter.id.$in(selectedTagIds).synonymId;
  store.$patch({
    activeNoteId,
    synonymIds,
  });

}

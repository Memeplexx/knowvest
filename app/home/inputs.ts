import { UserDTO } from "@/actions/types";
import { initializeDb, readFromDb, writeToStoreAndDb } from "@/utils/storage-utils";
import { useStore } from "@/utils/store-utils";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { useRef } from "react";
import { initialize } from "../../actions/session";
import { HomeStore, initialState } from "./constants";
import { useIsMounted, useIsomorphicLayoutEffect } from "@/utils/react-utils";


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
  await initializeDb();
  const databaseData = await readFromDb();
  const notesSorted = databaseData.notes.sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime());
  const after = notesSorted[0]?.dateUpdated;
  const apiResponse = await initialize({ ...session.user as UserDTO, after });
  if (apiResponse.status === 'USER_CREATED') {
    return store.$patch({
      ...databaseData,
      notes: [apiResponse.firstNote],
      activeNoteId: apiResponse.firstNote.id,
    });
  }
  await writeToStoreAndDb(store, apiResponse);
  const activeNoteId = notesSorted[0].id;
  const selectedTagIds = databaseData.noteTags.filter(nt => !nt.isArchived && nt.noteId === activeNoteId).map(nt => nt.tagId);
  const synonymIds = databaseData.tags.filter(t => !t.isArchived && selectedTagIds.includes(t.id)).map(t => t.synonymId);
  store.$patch({
    ...databaseData,
    activeNoteId,
    synonymIds,
  });
}

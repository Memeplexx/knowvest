import { UserDTO } from "@/actions/types";
import { useIsMounted, useIsomorphicLayoutEffect } from "@/utils/react-utils";
import { initializeDb, readFromDb, writeToStoreAndDb } from "@/utils/storage-utils";
import { AppState, useStore } from "@/utils/store-utils";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import { initialize } from "../../actions/session";
import { HomeStore, initialState } from "./constants";
import { Store } from "olik";


export const useInputs = () => {

  const { store, localState, localStore } = useStore({ key: 'home', value: initialState.home });

  useDataInitializer({ store });

  useLogoutUserIfSessionExpired();

  useHeaderExpander(store);

  return {
    store,
    ...localState,
    localStore,
  }
}

const useHeaderExpander = (store: HomeStore) => {
  useEffect(() => {
    const listener = () => {
      const { headerExpanded } = store.$state.home;
      if (window.innerWidth >= 1000 && !headerExpanded) {
        store.home.headerExpanded.$set(true);
      } else if (window.innerWidth < 1000 && headerExpanded) {
        store.home.headerExpanded.$set(false);
      }
    }
    listener();
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener);
  }, [store]);
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
  useEffect(() => {
    if (!session) return;
    if (!mounted) return;
    if (initializingData.current) return;
    if (store.stateInitialized.$state) return;
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
  const notesFromDbSorted = databaseData.notes.sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime());
  const after = notesFromDbSorted[0]?.dateUpdated ?? null;
  const apiResponse = await initialize({ ...session.user as UserDTO, after });
  if (apiResponse.status === 'USER_CREATED') {
    return store.$patch({
      ...databaseData,
      notes: [apiResponse.firstNote],
      activeNoteId: apiResponse.firstNote.id,
    });
  }
  await writeToStoreAndDb(store as Store<AppState>, apiResponse);
  const activeNoteId = notesFromDbSorted[0]?.id // Database might be empty. If so, use the first note from the API response
    ?? apiResponse.notes.reduce((prev, curr) => prev!.dateViewed! > curr.dateViewed! ? prev : curr, apiResponse.notes[0])!.id;
  const selectedTagIds = databaseData.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
  const synonymIds = databaseData.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct();
  store.$patch({
    ...databaseData,
    activeNoteId,
    synonymIds,
  });
}

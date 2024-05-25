import { UserDTO } from "@/actions/types";
import { MediaQueries, useMediaQueryListener, useResizeListener } from "@/utils/dom-utils";
import { useIsMounted } from "@/utils/react-utils";
import { initializeDb, readFromDb, writeToStoreAndDb } from "@/utils/storage-utils";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRef } from "react";
import { initialize } from "../../actions/session";
import { initialState } from "./constants";


export const useInputs = () => {

  const { store } = useStore();
  const { local, state } = useLocalStore('home', initialState);
  const refs = useRef({ initializingData: false, loggingOut: false });

  useMediaQueryListener(store.mediaQuery.$set);

  // Log user out if session expired
  const session = useSession();
  if (!refs.current.loggingOut) {
    refs.current.loggingOut = true;
    if (session.status === 'unauthenticated')
      redirect('/?session-expired=true');
  }

  // Update header visibility as required
  useResizeListener(() => {
    if (window.innerWidth >= MediaQueries.md && !local.$state.headerExpanded)
      local.headerExpanded.$set(true);
    else if (window.innerWidth < MediaQueries.md && local.$state.headerExpanded)
      local.headerExpanded.$set(false);
  });

  // Initialize data
  const mounted = useIsMounted();
  if (session.data && mounted && !refs.current.initializingData && !store.stateInitialized.$state) {
    refs.current.initializingData = true;
    void async function initializeData() {
      await initializeDb();
      const databaseData = await readFromDb();
      const notesFromDbSorted = databaseData.notes.sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime());
      const apiResponse = await initialize({ ...session.data.user as UserDTO, after: notesFromDbSorted[0]?.dateUpdated ?? null });
      if (apiResponse.status === 'USER_CREATED')
        return store.$patch({ ...databaseData, notes: [apiResponse.firstNote], activeNoteId: apiResponse.firstNote.id });
      await writeToStoreAndDb(store, apiResponse);
      const activeNoteId = notesFromDbSorted[0]?.id // Database might be empty. If so, use the first note from the API response
        ?? apiResponse.notes.reduce((prev, curr) => prev!.dateViewed! > curr.dateViewed! ? prev : curr, apiResponse.notes[0])!.id;
      const selectedTagIds = databaseData.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
      const synonymIds = databaseData.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct();
      store.$patch({ ...databaseData, activeNoteId, synonymIds });
      store.stateInitialized.$set(true);
    }();
  }

  return {
    store,
    local,
    ...state,
  }
}

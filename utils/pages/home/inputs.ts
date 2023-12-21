import { useEffect, useRef } from "react";
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { initialState, initialTransientState } from "./constants";
import { UserDTO } from "@/server/dtos";
import { useIsMounted, useIsomorphicLayoutEffect, useNestedStore, useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { AppState } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { ensureIndexedDBIsInitialized, readFromIndexedDB, writeToIndexedDB } from "@/utils/functions";
import { Store } from "olik";
import { Session } from "next-auth";


export const useInputs = () => {

  const store = useNestedStore(initialState)!;
  const state = store.home.$useState();

  useDataInitializer();

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

const useHeaderExpander = (store: Store<AppState & typeof initialState>) => {
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


export const useDataInitializer = () => {
  const { data: session } = useSession();
  const store = useNestedStore(initialState)!;
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

const initializeData = async ({ session, store }: { session: Session, store: Store<AppState & typeof initialState> }) => {
  await ensureIndexedDBIsInitialized();
  const dataFromIndexedDB = await readFromIndexedDB();
  const mostRecentlyUpdatedNode = dataFromIndexedDB.notes.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0] || null;
  const apiResponse = await trpc.session.initialize.mutate({ ...session.user as UserDTO, after: mostRecentlyUpdatedNode?.dateUpdated  });
  if (apiResponse.status === 'SESSION_INITIALIZED_FOR_NEW_USER') {
    store.$patch({
      notes: [apiResponse.note],
      activeNoteId: apiResponse.note.id,
    });
    store.home.initialized.$set(true);
    return;
  }
  store.$patchDeep(dataFromIndexedDB);
  store.notes.$mergeMatching.id.$withMany(apiResponse.data.notes);
  store.flashCards.$mergeMatching.id.$withMany(apiResponse.data.flashCards);
  store.groups.$mergeMatching.id.$withMany(apiResponse.data.groups);
  store.tags.$mergeMatching.id.$withMany(apiResponse.data.tags);
  store.noteTags.$mergeMatching.id.$withMany(apiResponse.data.noteTags);
  store.synonymGroups.$mergeMatching.id.$withMany(apiResponse.data.synonymGroups);
  await writeToIndexedDB(apiResponse.data);
  const { notes, noteTags, tags } = store.$state;
  const mostRecentlyViewNote = notes.slice().sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime())[0];
  const activeNoteId = mostRecentlyViewNote.id;
  const selectedTagIds = noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
  const synonymIds = tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct();
  store.$patchDeep({ activeNoteId, synonymIds });
  store.home.initialized.$set(true);
}
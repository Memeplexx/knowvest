import { useContext, useEffect } from "react";
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { initialState, initialTransientState } from "./constants";
import { NoteId, UserDTO } from "@/server/dtos";
import { useIsMounted, useIsomorphicLayoutEffect, useNestedStore, useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { AppState, StoreContext, database } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { ensureIndexedDBIsInitialized, readFromIndexedDB, writeToIndexedDB } from "@/utils/functions";
import { Store } from "olik";


export const useInputs = () => {

  const store = useNestedStore(initialState)!;
  const state = store.home.$useState();

  useSessionInitializer();

  useLogoutUserIfSessionExpired();

  useStoreAndIndexedDBInitializer();

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

const useStoreAndIndexedDBInitializer = () => {
  const store = useNestedStore(initialState)!;
  const mounted = useIsMounted();
  useEffect(() => {
    if (!mounted) { return; }
    ensureIndexedDBIsInitialized()
      .then(() => readFromIndexedDB())
      .then(data => {
        const activeNoteId = data.notes[0]?.id || 0 as NoteId;
        const selectedTagIds = data.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
        const synonymIds = data.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct()
        store.$patchDeep({
          ...data,
          activeNoteId,
          synonymIds,
        });
      })
      .then(() => {
        const { notes, synonymGroups, noteTags, tags, groups, flashCards } = store.$state;
        const mostRecentlyUpdatedRecord = <T extends { dateUpdated: Date | null }>(items: T[]) => {
          return { after: items.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0]?.dateUpdated };
        }
        return Promise.all([
          trpc.note.list.query(mostRecentlyUpdatedRecord(notes))
            .then(response => store.notes.$mergeMatching.id.$withMany(response.notes)),
          trpc.group.list.query(mostRecentlyUpdatedRecord(groups))
            .then(response => store.groups.$mergeMatching.id.$withMany(response.groups)),
          trpc.tag.list.query(mostRecentlyUpdatedRecord(tags))
            .then(response => store.tags.$mergeMatching.id.$withMany(response.tags)),
          trpc.noteTag.list.query(mostRecentlyUpdatedRecord(noteTags))
            .then(response => store.noteTags.$mergeMatching.id.$withMany(response.noteTags)),
          trpc.synonym.listSynonymGroups.query(mostRecentlyUpdatedRecord(synonymGroups))
            .then(response => store.synonymGroups.$mergeMatching.id.$withMany(response.synonymGroups)),
          trpc.flashCard.list.query(mostRecentlyUpdatedRecord(flashCards))
            .then(response => store.flashCards.$mergeMatching.id.$withMany(response.flashCards)),
        ])
      })
      .then(() => {
        // Continue to listen for changes
        (Object.keys(database) as Array<keyof typeof database>)
          .map(key => store[key].$onChange(d => {
            if (!d.length) { return; }
            writeToIndexedDB(key, d);
          }))
      })
      .catch(console.error);
  }, [mounted, store])
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

const useSessionInitializer = () => {
  const { data: session } = useSession();
  const store = useContext(StoreContext)!;
  useEffect(() => {
    if (!session) { return; }
    trpc.session.initialize.mutate(session!.user as UserDTO)
      .then(response => {
        if (response.note) {
          store.notes.id.$set(response.note.id);
        }
      }).catch(console.error);
  }, [session, store]);
}

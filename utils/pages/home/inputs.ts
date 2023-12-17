import { useContext, useEffect } from "react";
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { initialState, initialTransientState } from "./constants";
import { NoteId, UserDTO } from "@/server/dtos";
import { useIsMounted, useIsomorphicLayoutEffect, useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { StoreContext, database, useContextForNestedStore } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { ensureIndexedDBIsInitialized, readFromIndexedDB, writeToIndexedDB } from "@/utils/functions";


export const useInputs = () => {

  const store = useContextForNestedStore(initialState)!;
  const state = store.home.$useState();

  useSessionInitializer();

  useLogoutUserIfSessionExpired();

  useStoreAndIndexedDBInitializer();

  useInitializeOlikDevtools();

  useHeaderExpander();

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
  const store = useContextForNestedStore(initialState)!;
  const mounted = useIsMounted();
  useEffect(() => {
    if (!mounted) { return; }
    ensureIndexedDBIsInitialized()
      .then(() => readFromIndexedDB())
      .then(data => {
        const activeNoteId = data.notes[0]?.id || 1 as NoteId;
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
        return Promise.all([
          trpc.note.list.query({ after: notes.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0]?.dateUpdated }),
          trpc.group.list.query({ after: groups.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0]?.dateUpdated }),
          trpc.tag.list.query({ after: tags.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0]?.dateUpdated }),
          trpc.noteTag.list.query({ after: noteTags.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0]?.dateUpdated }),
          trpc.synonym.listSynonymGroups.query({ after: synonymGroups.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0]?.dateUpdated }),
          trpc.flashCard.list.query({ after: flashCards.slice().sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime())[0]?.dateUpdated }),
        ])
      })
      .then(response => {

        // Ensure that the store any new records that may have been synced to the server
        store.notes.$mergeMatching.id.$withMany(response[0].notes);
        store.groups.$mergeMatching.id.$withMany(response[1].groups);
        store.tags.$mergeMatching.id.$withMany(response[2].tags);
        store.noteTags.$mergeMatching.id.$withMany(response[3].noteTags);
        store.synonymGroups.$mergeMatching.id.$withMany(response[4].synonymGroups);
        store.flashCards.$mergeMatching.id.$withMany(response[5].flashCards);

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

const useHeaderExpander = () => {
  const store = useContextForNestedStore(initialState)!;
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

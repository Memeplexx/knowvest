import { useContext, useEffect, useRef } from "react";
import { connectOlikDevtoolsToStore } from "olik/devtools";
import { ServerSideProps, initialTransientState } from "./constants";
import { NoteId } from "@/server/dtos";
import { useIsomorphicLayoutEffect, useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { StoreContext } from "@/utils/constants";


export const useInputs = (props: ServerSideProps) => {

  const store = useContext(StoreContext)!;

  useLogoutUserIfSessionExpired();

  useStoreStateInitializer(props);

  useInitializeOlikDevtools();

  useHeaderExpander();

  return {
    store,
    ...useRecord(initialTransientState),
    ...store.home.$useState(),
  }
}

const useInitializeOlikDevtools = () => {
  useEffect(() => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      connectOlikDevtoolsToStore({ trace: false });
    }
  }, []);
}

const useStoreStateInitializer = (props: ServerSideProps) => {
  const init = useRef(false);
  const store = useContext(StoreContext)!;
  if (!init.current) {
    init.current = true;
    const activeNoteId = props.notes[0]?.id || 0 as NoteId;
    const selectedTagIds = props.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
    store.$patchDeep({
      ...props,
      activeNoteId,
      synonymIds: props.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct(),
      activePanel: {
        editorHasText: !!props.notes[0]?.text || false,
      }
    });
  }
}

const useHeaderExpander = () => {
  const store = useContext(StoreContext)!;
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

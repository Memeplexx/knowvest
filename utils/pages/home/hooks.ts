import { useEffect, useRef } from "react";
import { connectOlikDevtoolsToStore } from "olik";
import { ServerSideProps, initialTransientState } from "./constants";
import { NoteId } from "@/server/dtos";
import { useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { store } from "@/utils/store";

export const useHooks = (props: ServerSideProps) => {

  useLogoutUserIfSessionExpired();

  const activeNoteId = useRef(props.notes[0]?.id || 0 as NoteId).current;
  const selectedTagIds = useRef(props.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId)).current;

  const init = useRef(true);
  if (init.current) {
    store.$patchDeep({
      ...props,
      activeNoteId,
      synonymIds: props.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct(),
      activePanel: {
        editorHasText: !!props.notes[0]?.text || false,
      }
    });
    init.current = false;
  }

  const state = store.home.$useState();

  const transient = useRecord(
    initialTransientState
  )

  useEffect(() => {
    connectOlikDevtoolsToStore({ trace: true });
  }, []);

  return {
    store,
    ...transient,
    ...state,
  }
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
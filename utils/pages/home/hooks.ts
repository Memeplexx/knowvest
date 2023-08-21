import { useEffect, useRef } from "react";
import { connectOlikDevtoolsToStore } from "olik";
import { useGlobalStore, useNestedStore } from "olik-react";
import { ServerSideProps, initialState, initialTransientState } from "./constants";
import { NoteId } from "@/server/dtos";
import { useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

export const useHooks = (props: ServerSideProps) => {

  useLogoutUserIfSessionExpired();

  const activeNoteId = useRef(props.notes[0]?.id || 0 as NoteId).current;
  const selectedTagIds = useRef(props.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId)).current;
  const appStore = useGlobalStore({
    ...props,
    activeNoteId,
    synonymIds: props.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct(),
  });

  const { store, state } = useNestedStore(
    initialState
  ).usingAccessor(s => s.homeComponent);

  const transient = useRecord(
    initialTransientState
  )

  useEffect(() => {
    connectOlikDevtoolsToStore({ trace: true });
  }, []);

  return {
    store,
    appStore,
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
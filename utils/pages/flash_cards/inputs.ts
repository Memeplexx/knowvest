import { NoteId } from "@/server/dtos";
import { StoreContext } from "@/utils/constants";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef } from "react";
import { ServerSideProps } from "./constants";
import { NotificationContext } from "../home/constants";

export const useInputs = (props: ServerSideProps) => {
  const store = useContext(StoreContext)!;
  const router = useRouter();
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    if (router.query.noteId) {
      const activeNoteId = +router.query.noteId as unknown as NoteId;
      store.activeNoteId.$set(activeNoteId);
      store.flashCards.$set(props.flashCards);
    }
  }
  useEffect(() => {
    if (!store.$state.notes.length) {
      router.replace('/')
    }
  }, [])
  return {
    flashCards: store.flashCards.$useState(),
    confirmDeleteFlashCardId: store.flashCardPanel.confirmDeleteFlashCardId.$useState(),
    notify: useContext(NotificationContext)!,
    store,
  }
}
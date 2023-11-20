import { NoteId } from "@/server/dtos";
import { StoreContext } from "@/utils/constants";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
import { ServerSideProps } from "./constants";

export const useInputs = (props: ServerSideProps) => {
  const store = useContext(StoreContext)!;
  const router = useRouter();
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    if (router.query.noteId) {
      const activeNoteId = +router.query.noteId as unknown as NoteId;
      store.activeNoteId.$set(activeNoteId);
    }
  }
  useEffect(() => {
    if (!store.$state.notes.length) {
      router.replace('/')
    }
  }, [])
  return {
    ...props,
    store,
  }
}
import { StoreContext, initialAppState } from "@/utils/constants";
import { Container, Editor, Questions, Wrapper } from "@/utils/pages/test-config/styles";
import { useContext, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import { NoteId } from "@/server/dtos";
import { Navbar } from "@/components/navbar";
import ActiveEditor from "@/components/active-editor";



export default function ConfigureTest(
) {
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

  return (
    <Container
      children={
        <>
          <Navbar
            // showIf={inputs.headerExpanded}
            showIf={true}
          />
          <Wrapper
            children={
              <>
                <Editor
                  showIf={!!store.$state.notes.length}
                  title="Editor"
                  body={<ActiveEditor />}
                />
                <Questions
                  title="Questions"
                  body={
                    <>
                      Here be content
                    </>
                  }
                />
              </>
            }
          />
        </>
      }
    />
  )
}
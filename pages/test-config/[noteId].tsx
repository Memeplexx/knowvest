import { StoreContext, initialAppState } from "@/utils/constants";
import { Container, Editor, Questions, Wrapper } from "@/utils/pages/test-config/styles";
import { useContext, useRef } from "react";
import { useRouter } from 'next/router';
import { NoteId } from "@/server/dtos";
import superjson from 'superjson';
import { ServerSideProps } from "@/utils/pages/home/constants";
import { getCommonServerSideProps } from "@/utils/server-side-props";
import { Navbar } from "@/components/navbar";
import ActiveEditor from "@/components/active-editor";


export const getServerSideProps = getCommonServerSideProps;

export default function ConfigureTest(
  propsSerialized: Parameters<typeof superjson.deserialize>[0],
) {
  const store = useContext(StoreContext)!;
  const router = useRouter();
  const props = superjson.deserialize<ServerSideProps>(propsSerialized);
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    const activeNoteId = +(router.query.noteId as unknown as NoteId);
    const selectedTagIds = props.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId);
    store.$patchDeep({
      ...initialAppState,
      ...props,
      activeNoteId,
      synonymIds: props.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct(),
      activePanel: {
        editorHasText: !!props.notes[0]?.text || false,
      }
    });
  }
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
                  title="Editor"
                  body={<ActiveEditor/>}
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
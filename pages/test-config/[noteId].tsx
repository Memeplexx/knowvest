import { Container, Editor, Questions, Wrapper } from "@/utils/pages/test-config/styles";
import { Navbar } from "@/components/navbar";
import ActiveEditor from "@/components/active-editor";
import { GetServerSidePropsContext } from "next/types";
import { prisma } from "@/server/routers/_app";
import superjson from 'superjson';
import { useInputs } from "@/utils/pages/test-config/inputs";
import { ServerSideProps } from "@/utils/pages/test-config/constants";


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const noteId = context.params!.noteId;
  if (!noteId) { throw new Error(); }
  return {
    props: superjson.serialize({
      questions: await prisma.question.findMany({ where: { noteId: +noteId } }),
    })
  };
}

export default function ConfigureTest(
  propsSerialized: Parameters<typeof superjson.deserialize>[0],
) {
  const inputs = useInputs(superjson.deserialize<ServerSideProps>(propsSerialized));
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
                  showIf={!!inputs.store.$state.notes.length}
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
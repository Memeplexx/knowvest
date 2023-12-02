import { Container, Editor, FlashCard, FlashCardText, FlashCardWrapper, FlashCards, Wrapper } from "@/utils/pages/flash_cards/styles";
import { Navbar } from "@/components/navbar";
import ActiveEditor from "@/components/active-editor";
import { GetServerSidePropsContext } from "next/types";
import { prisma } from "@/server/routers/_app";
import superjson from 'superjson';
import { useInputs } from "@/utils/pages/flash_cards/inputs";
import { ServerSideProps } from "@/utils/pages/flash_cards/constants";
import { ButtonIcon } from "@/components/button-icon";
import { AddIcon, DeleteIcon } from "@/utils/styles";
import { useOutputs } from "@/utils/pages/flash_cards/outputs";
import { Confirmation } from "@/components/confirmation";


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const noteId = context.params!.noteId;
  if (!noteId) { throw new Error(); }
  return {
    props: superjson.serialize({
      flashCards: await prisma.flashCard.findMany({ where: { noteId: +noteId } }),
    })
  };
}

export default function ConfigureTest(
  propsSerialized: Parameters<typeof superjson.deserialize>[0],
) {
  const inputs = useInputs(superjson.deserialize<ServerSideProps>(propsSerialized));
  const outputs = useOutputs(inputs);
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
                <FlashCards
                  title="FlashCards"
                  actions={
                    <ButtonIcon
                      children={<AddIcon />}
                      title="Create new Flashcard"
                      onClick={outputs.onClickCreateFlashCard}
                    />
                  }
                  body={
                    <FlashCardWrapper
                      children={
                        inputs.flashCards.map(flashCard => (
                          <FlashCard
                            key={flashCard.id}
                            children={
                              <>
                                <FlashCardText
                                  value={flashCard.text}
                                  onChange={e => outputs.onChangeFlashCardText(flashCard.id, e.target.value)}
                                  placeholder="Create a question to test yourself with..."
                                  rows={4}
                                />
                                <ButtonIcon
                                  children={<DeleteIcon />}
                                  onClick={() => outputs.onClickRequestDeleteFlashCard(flashCard.id)}
                                />
                                <Confirmation
                                  showIf={!!inputs.confirmDeleteFlashCardId}
                                  onClose={() => inputs.store.flashCardPanel.confirmDeleteFlashCardId.$set(null)}
                                  onConfirm={() => outputs.onClickRemoveFlashCard(flashCard.id)}
                                  title='Delete note requested'
                                  message='Are you sure you want to delete this flash card?'
                                />
                              </>
                            }
                          />
                        ))
                      }
                    />
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
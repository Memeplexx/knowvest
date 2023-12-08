import { ButtonIcon } from "@/components/button-icon";
import { Confirmation } from "@/components/confirmation";
import { NoResultsIcon } from "@/components/related-items/styles";
import { AddIcon, DeleteIcon } from "@/utils/styles";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Container, CreateNewButton, FlashCard, FlashCardText, FlashCardWrapper, NoResults } from "./styles";


export const FlashCards = () => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <CreateNewButton
        children={<AddIcon />}
        title="Create new Flashcard"
        onClick={outputs.onClickCreateFlashCard}
      />
      <Container
        children={
          <>
            <FlashCardWrapper
              showIf={!!inputs.flashCards.length}
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
            <NoResults
              showIf={!inputs.flashCards.length}
              children={
                <>
                  <NoResultsIcon />
                  no related notes
                </>
              }
            />
          </>
        }
      />
    </>
  )
}
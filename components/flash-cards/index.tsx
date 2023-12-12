import { Confirmation } from "@/components/confirmation";
import { NoResultsIcon } from "@/components/related-items/styles";
import { AddIcon, DeleteIcon } from "@/utils/styles";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Container, CreateNewButton, DeleteButton, FlashCard, TextArea, FlashCardWrapper, NoResults } from "./styles";


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
              showIf={!!inputs.items.length}
              children={
                inputs.items.map(flashCard => (
                  <FlashCard
                    key={flashCard.id}
                    children={
                      <>
                        <TextArea
                          value={flashCard.text}
                          onChangeDebounced={outputs.onChangeFlashCardText(flashCard.id)}
                          placeholder="Create a question to test yourself with..."
                          rows={4}
                        />
                        <DeleteButton
                          showIf={!!flashCard.text}
                          children={<DeleteIcon />}
                          onClick={outputs.onClickRequestDeleteFlashCard(flashCard.id)}
                        />
                        <Confirmation
                          showIf={!!inputs.confirmDeleteId}
                          onClose={outputs.onCancelRemoveFlashCard}
                          onConfirm={outputs.onConfirmRemoveFlashCard(flashCard.id)}
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
              showIf={!inputs.items.length}
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
import { Confirmation } from "@/components/confirmation";
import { NoResultsIcon } from "@/components/related-items/styles";
import { AddIcon, DeleteIcon } from "@/utils/styles";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Container, CreateNewButton, DeleteButton, FlashCard, FlashCardText, FlashCardWrapper, NoResults } from "./styles";


export const FlashCards = () => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { items, confirmDeleteId, store } = inputs;
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
              showIf={!!items.length}
              children={
                items.map(flashCard => (
                  <FlashCard
                    key={flashCard.id}
                    children={
                      <>
                        <FlashCardText
                          value={flashCard.text}
                          onChange={e => outputs.onChangeFlashCardText(flashCard.id, e.target.value)}
                          onFocus={() => outputs.onFocusTextEditor(flashCard.id)}
                          onBlur={outputs.onBlurTextEditor}
                          placeholder="Create a question to test yourself with..."
                          rows={4}
                        />
                        <DeleteButton
                          showIf={!!flashCard.text && inputs.focusId === flashCard.id}
                          children={<DeleteIcon />}
                          onClick={() => outputs.onClickRequestDeleteFlashCard(flashCard.id)}
                        />
                        <Confirmation
                          showIf={!!confirmDeleteId}
                          onClose={() => store.flashCards.confirmDeleteId.$set(null)}
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
              showIf={!items.length}
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
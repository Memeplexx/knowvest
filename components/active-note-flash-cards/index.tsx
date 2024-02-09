import { Confirmation } from "@/components/confirmation";
import { NoResultsIcon } from "@/components/related-items/styles";
import { AddIcon, DeleteIcon } from "@/utils/styles";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Container, CreateNewButton, DeleteButton, FlashCard, TextArea, FlashCardWrapper, NoResults } from "./styles";


export const ActiveNoteFlashCards = () => {
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
                inputs.items.map(item => (
                  <FlashCard
                    key={item.id}
                    children={
                      <>
                        <TextArea
                          value={item.text}
                          onChangeDebounced={text => outputs.onChangeFlashCardText(item.id, text)}
                          placeholder="Create a question to test yourself with..."
                          rows={4}
                        />
                        <DeleteButton
                          showIf={!!item.text}
                          children={<DeleteIcon />}
                          onClick={() => outputs.onClickRequestDeleteFlashCard(item.id)}
                        />
                        <Confirmation
                          showIf={!!inputs.confirmDeleteId}
                          onClose={outputs.onCancelRemoveFlashCard}
                          onConfirm={() => outputs.onConfirmRemoveFlashCard(item.id)}
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
                  no flash cards created yet
                </>
              }
            />
          </>
        }
      />
    </>
  )
}
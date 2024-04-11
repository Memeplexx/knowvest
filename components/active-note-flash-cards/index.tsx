"use client";
import { Confirmation } from "@/components/confirmation";
import { AddIcon, DeleteIcon } from "@/utils/style-utils";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Container, CreateNewButton, DeleteButton, FlashCard, TextArea, FlashCardWrapper, NoResults, NoResultsIcon } from "./styles";


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
              if={!!inputs.items.length}
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
                          if={!!item.text}
                          children={<DeleteIcon />}
                          onClick={() => outputs.onClickRequestDeleteFlashCard(item.id)}
                        />
                        <Confirmation
                          if={!!inputs.confirmDeleteId}
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
              if={!inputs.items.length}
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
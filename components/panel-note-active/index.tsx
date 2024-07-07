"use client";
import { useHtmlPropsOnly } from '@/utils/react-utils';
import { type HTMLAttributes } from 'react';
import { BiCut } from 'react-icons/bi';
import { CiCirclePlus, CiFilter, CiSettings, CiTrash } from 'react-icons/ci';
import { OverlayConfirmation } from '../overlay-confirmation';
import { OverlayLoader } from '../overlay-loader';
import { FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ActiveSelectionListItem, CreateFlashCardButton, CreateFlashCardInstruction, DeleteFlashCardButton, FlashCard, FlashCardActions, FlashCardItemsWrapper, FlashCardWrapper, PanelNoteActiveWrapper, SelectionOptions, SelectionText, TextArea, TextEditor, TextEditorWrapper } from './styles';



export const PanelNoteActive = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <PanelNoteActiveWrapper
      {...useHtmlPropsOnly(props)}
      children={
        <>
          <EditorFragment
            {...fragmentProps}
          />
          <FlashCardFragment
            {...fragmentProps}
          />
        </>
      }
    />
  )
}

const EditorFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <TextEditorWrapper
      onClick={outputs.onClickTextEditorWrapper}
      children={
        <>
          <TextEditor
            ref={inputs.editorRef}
            $textIsSelected={!!inputs.selection.trim()}
          />
          <SelectionOptions
            if={!!inputs.selection}
            children={
              <>
                <SelectionText
                  children={'"' + inputs.selection + '"'}
                />
                <ActiveSelectionListItem
                  if={!inputs.selectionIsTag}
                  onClick={outputs.onClickCreateNewTagFromSelection.bind(this)}
                  children={
                    <>
                      <CiCirclePlus />
                      Create a new tag out of selection
                    </>
                  }
                />
                <ActiveSelectionListItem
                  if={inputs.selectionIsTag}
                  onClick={outputs.onClickConfigureSelectedTag.bind(this)}
                  children={
                    <>
                      <CiSettings />
                      Configure selected tag
                    </>
                  }
                />
                <ActiveSelectionListItem
                  onClick={outputs.onClickSplitNoteFromSelection.bind(this)}
                  children={
                    <>
                      <BiCut />
                      Move selection out into a new note
                    </>
                  }
                />
                <ActiveSelectionListItem
                  onClick={outputs.onClickFilterNotesFromSelection.bind(this)}
                  children={
                    <>
                      <CiFilter />
                      Filter notes similar to selection
                    </>
                  }
                />
                <OverlayLoader
                  if={inputs.loadingSelection}
                />
              </>
            }
          />
        </>
      }
    />
  );
}

const FlashCardFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <FlashCardWrapper
      children={
        <>
          <FlashCardActions
            $if={inputs.canCreateFlashCard}
            children={
              <>
                <CreateFlashCardInstruction
                  children='Add Flash Card to test yourself with'
                />
                <CreateFlashCardButton
                  onClick={outputs.onClickCreateFlashCard.bind(this)}
                  children={<CiCirclePlus />}
                />
              </>
            }
          />
          <FlashCardItemsWrapper
            children={inputs.noteFlashCards.map(flashCard => (
              <FlashCard
                key={flashCard.id}
                children={
                  <>
                    <DeleteFlashCardButton
                      onClick={outputs.onClickRequestDeleteFlashCard.bind(this)}
                      children={<CiTrash />}
                    />
                    <TextArea
                      value={flashCard.text}
                      placeholder='Enter a question...'
                      onChangeDebounced={outputs.onChangeFlashCardText.bind(this, flashCard.id)}
                    />
                    <OverlayConfirmation
                      if={inputs.confirmDeleteFashCard}
                      storeKey='deleteFlashCard'
                      onClose={outputs.onClickCancelRemoveFlashCard.bind(this)}
                      onConfirm={outputs.onClickConfirmDeleteFlashCard.bind(this, flashCard.id)}
                      title='Delete Flash Card requested'
                      message='Are you sure you want to delete this flash card?'
                    />
                  </>
                }
              />
            ))}
          />
        </>
      }
    />
  );
}

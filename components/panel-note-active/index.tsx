"use client";
import { useHtmlPropsOnly } from '@/utils/react-utils';
import { type HTMLAttributes } from 'react';
import { CiCirclePlus, CiFilter, CiMaximize1, CiSettings, CiTrash } from 'react-icons/ci';
import { OverlayConfirmation } from '../overlay-confirmation';
import { OverlayLoader } from '../overlay-loader';
import { FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ActiveSelectionListItem, DeleteButton, FlashCard, PanelNoteActiveWrapper, SelectionOptions, SelectionText, TextArea, TextEditor, TextEditorWrapper } from './styles';



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
                      <CiMaximize1 />
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
    <>
      {inputs.noteFlashCards.map(flashCard => (
        <FlashCard
          key={flashCard.id}
          children={
            <>
              <TextArea
                value={flashCard.text}
                onChangeDebounced={outputs.onChangeFlashCardText.bind(this, flashCard.id)}
              />
              <DeleteButton
                onClick={outputs.onClickRequestDeleteFlashCard.bind(this)}
                children={<CiTrash />}
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
    </>
  );
}

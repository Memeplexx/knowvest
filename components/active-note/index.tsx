"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { AddIcon, DeleteIcon, FilterIcon, SettingsIcon, SplitIcon } from '@/utils/style-utils';
import { type HTMLAttributes } from 'react';
import { Confirmation } from '../confirmation';
import { Loader } from '../loader';
import { FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ActivePanelWrapper, ActiveSelectionListItem, DeleteButton, FlashCard, SelectionOptions, SelectionText, TextArea, TextEditor, TextEditorWrapper } from './styles';



export const ActiveNote = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <ActivePanelWrapper
      {...useUnknownPropsStripper(props)}
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
                  onClick={outputs.onClickCreateNewTagFromSelection}
                  children={
                    <>
                      <AddIcon />
                      Create a new tag out of selection
                    </>
                  }
                />
                <ActiveSelectionListItem
                  if={inputs.selectionIsTag}
                  onClick={outputs.onClickConfigureSelectedTag}
                  children={
                    <>
                      <SettingsIcon />
                      Configure selected tag
                    </>
                  }
                />
                <ActiveSelectionListItem
                  onClick={outputs.onClickSplitNoteFromSelection}
                  children={
                    <>
                      <SplitIcon />
                      Move selection out into a new note
                    </>
                  }
                />
                <ActiveSelectionListItem
                  onClick={outputs.onClickFilterNotesFromSelection}
                  children={
                    <>
                      <FilterIcon />
                      Filter notes similar to selection
                    </>
                  }
                />
                <Loader
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
                onChangeDebounced={outputs.onChangeFlashCardText(flashCard.id)}
              />
              <DeleteButton
                onClick={outputs.onClickRequestDeleteFlashCard}
                children={<DeleteIcon />}
              />
              <Confirmation
                if={inputs.confirmDeleteFashCard}
                storeKey='deleteFlashCard'
                onClose={outputs.onClickCancelRemoveFlashCard}
                onConfirm={outputs.onClickConfirmDeleteFlashCard(flashCard.id)}
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

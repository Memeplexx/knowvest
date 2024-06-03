"use client";
import { AddIcon, CreateIcon, DeleteIcon, DuplicateIcon, FilterIcon, PopupOption, SettingsIcon, SplitIcon } from '@/utils/style-utils';
import { type HTMLAttributes } from 'react';
import { ButtonIcon } from '../button-icon';
import { Confirmation } from '../confirmation';
import { Loader } from '../loader';
import { Popup } from '../popup';
import { FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ActiveSelection, ActiveSelectionInstructions, ActiveSelectionListItem, ActiveSelectionTagName, CardWrapper, TextEditor, TextEditorWrapper, Wrapper } from './styles';



export const ActivePanel = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <Wrapper
      {...props}
      children={
        <>
          <CardWrapper
            heading="Active"
            actions={<SettingsMenu {...fragmentProps} />}
            body={<EditorFragment {...fragmentProps} />}
          />
        </>
      }
    />
  )
}

const SettingsMenu = ({ inputs, outputs }: FragmentProps) => {
  return (
    <>
      <Popup
        storeKey='settingsMenu'
        ref={inputs.popupRef}
        trigger={props => (
          <ButtonIcon
            {...props}
            aria-label='Settings'
            children={<SettingsIcon />}
          />
        )}
        overlay={
          <>
            <PopupOption
              onClick={outputs.onClickCreateNote}
              children={
                <>
                  Create new note
                  <CreateIcon />
                </>
              }
            />
            <PopupOption
              onClick={outputs.onClickDuplicateNote}
              children={
                <>
                  Duplicate this note
                  <DuplicateIcon />
                </>
              }
            />
            <PopupOption
              disabled={!inputs.mayDeleteNote}
              onClick={outputs.onClickRequestDeleteNote}
              children={
                <>
                  Delete this note
                  <DeleteIcon />
                </>
              }
            />
          </>
        }
      />
      <Confirmation
        if={inputs.confirmDelete}
        storeKey='deleteNote'
        onClose={outputs.onClickCancelRemoveNote}
        onConfirm={outputs.onClickConfirmRemoveNote}
        title='Delete note requested'
        message='Are you sure you want to delete this note?'
      />
    </>
  );
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
          <ActiveSelection
            if={!!inputs.selection}
            children={
              <>
                <ActiveSelectionTagName
                  children={'"' + inputs.selection + '"'}
                />
                <ActiveSelectionInstructions
                  children={
                    <>
                      <ActiveSelectionListItem
                        onClick={outputs.onClickCreateNewTagFromSelection}
                        children={
                          <>
                            <AddIcon />
                            Create a new tag out of selection
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

import { useInputs } from './inputs';
import { ActiveSelection, ActiveSelectionInstructions, ActiveSelectionListItem, ActiveSelectionTagName, Buttons, CardWrapper, Instruction, TextEditor, TextEditorWrapper, Wrapper } from './styles';
import { useOutputs } from './outputs';
import { IconButton } from '../card-header-button';
import { Confirmation } from '../confirmation';
import { CreateIcon, DeleteIcon, DuplicateIcon, PopupOption, OptionText, PopupOptions, SettingsIcon, AddIcon, SplitIcon, FilterIcon } from '@/utils/styles';
import { HTMLAttributes } from 'react';
import { store } from '@/utils/store';
import { Loader } from '../loader';



export const Active = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <Wrapper
      {...props}
      children={
        <>
          <CardWrapper
            title="Active"
            $themeType='light'
            actions={
              <Buttons
                children={
                  <>
                    <IconButton
                      showIf={!state.selection.trim().length}
                      onClick={outputs.onClickCreateNote}
                      title='Create a new note'
                      children={<CreateIcon />}
                    />
                    <IconButton
                      children={<SettingsIcon />}
                      onClick={outputs.onClickSettingsButton}
                      ref={refs.floating.refs.setReference}
                    />
                    <PopupOptions
                      showIf={state.showOptions}
                      ref={refs.floating.refs.setFloating}
                      style={refs.floating.floatingStyles}
                      children={
                        <>
                          <PopupOption
                            onClick={outputs.onClickDuplicateNote}
                            children={
                              <>
                                <OptionText
                                  children='Duplicate this note'
                                />
                                <DuplicateIcon
                                />
                              </>
                            }
                          />
                          <PopupOption
                            disabled={!state.mayDeleteNote}
                            onClick={outputs.onClickRequestDeleteNote}
                            children={
                              <>
                                <OptionText
                                  children='Delete this note'
                                />
                                <DeleteIcon
                                />
                              </>
                            }
                          />
                        </>
                      }
                    />
                    <Confirmation
                      show={state.confirmDelete}
                      onClose={() => store.activePanel.confirmDelete.$set(false)}
                      onConfirm={outputs.onClickRemoveNote}
                      title='Delete note requested'
                      message='Are you sure you want to delete this note?'
                    />
                  </>
                }
              />
            }
            body={
              <TextEditorWrapper
                onClick={outputs.onClickTextEditorWrapper}
                children={
                  <>
                    <TextEditor
                      ref={refs.editor}
                      onBlur={outputs.onBlurTextEditor}
                    />
                    <ActiveSelection
                      showIf={!!state.selection}
                      children={
                        <>
                          <ActiveSelectionTagName
                            children={'"' + state.selection + '"'}
                          />
                          <ActiveSelectionInstructions
                            children={
                              <>
                                <ActiveSelectionListItem
                                  onClick={outputs.onClickCreateNewTagFromSelection}
                                  children={
                                    <>
                                      <AddIcon />
                                      <Instruction
                                        children='Create a new tag out of selection'
                                      />
                                    </>
                                  }
                                />
                                <ActiveSelectionListItem
                                  onClick={outputs.onClickSplitNoteFromSelection}
                                  children={
                                    <>
                                      <SplitIcon />
                                      <Instruction
                                        children='Move selection out into a new note'
                                      />
                                    </>
                                  }
                                />
                                <ActiveSelectionListItem
                                  onClick={outputs.onClickFilterNotesFromSelection}
                                  children={
                                    <>
                                      <FilterIcon />
                                      <Instruction
                                        children='Filter notes similar to selection'
                                      />
                                    </>
                                  }
                                />
                              </>
                            }
                          />
                          <Loader
                            showIf={state.loadingSelection}
                          />
                        </>
                      }
                    />
                  </>
                }
              />
            }
          />
          <Loader
            showIf={state.loadingNote}
          />
        </>
      }
    />
  )
};



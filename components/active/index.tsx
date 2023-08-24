import { useInputs } from './inputs';
import { Buttons, SelectionOptions, TextEditor, TextEditorWrapper } from './styles';
import { useEvents as useOutputs } from './outputs';
import { IconButton } from '../card-header-button';
import { Confirmation } from '../confirmation';
import { Card } from '../card';
import { CreateIcon, DeleteIcon, DuplicateIcon, PopupOption, OptionText, PopupOptions, SettingsIcon } from '@/utils/styles';
import { HTMLAttributes } from 'react';
import { store } from '@/utils/store';



export const Active = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <Card
      {...props}
      title="Active"
      $themeType='light'
      actions={
        <Buttons
          children={
            <>
              <IconButton
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
              <SelectionOptions
                showIf={!!state.selection}
                onClickCreateNewTag={outputs.onClickCreateNewTagFromSelection}
                onClickFilterNotes={outputs.onClickFilterNotesFromSelection}
                onClickSplitNote={outputs.onClickSplitNoteFromSelection}
                selection={state.selection}
              />
            </>
          }
        />
      }
    />
  )
};



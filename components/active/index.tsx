import { useHooks } from './hooks';
import { Buttons, SelectionOptions, TextEditor, TextEditorWrapper } from './styles';
import { useEvents } from './events';
import { IconButton } from '../card-header-button';
import { Confirmation } from '../confirmation';
import { Card } from '../card';
import { CreateIcon, DeleteIcon, DuplicateIcon, PopupOption, OptionText, PopupOptions, SettingsIcon } from '@/utils/styles';
import { HTMLAttributes } from 'react';



export const Active = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const state = useHooks();
  const events = useEvents(state);
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
                onClick={events.onClickCreateNote}
                title='Create a new note'
                children={<CreateIcon />}
              />
              <IconButton
                children={<SettingsIcon />}
                onClick={events.onClickSettingsButton}
                ref={state.floating.refs.setReference}
              />
              <PopupOptions
                showIf={state.showOptions}
                ref={state.floating.refs.setFloating}
                style={state.floating.floatingStyles}
                children={
                  <>
                    <PopupOption
                      onClick={events.onClickDuplicateNote}
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
                      onClick={events.onClickRequestDeleteNote}
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
                onClose={() => state.store.confirmDelete.$set(false)}
                onConfirm={events.onClickRemoveNote}
                title='Delete note requested'
                message='Are you sure you want to delete this note?'
              />
            </>
          }
        />
      }
      body={
        <TextEditorWrapper
          onClick={events.onClickTextEditorWrapper}
          children={
            <>
              <TextEditor
                ref={state.editorDomElement}
                onBlur={events.onBlurTextEditor}
              />
              <SelectionOptions
                showIf={!!state.selection}
                onClickCreateNewTag={events.onClickCreateNewTagFromSelection}
                onClickFilterNotes={events.onClickFilterNotesFromSelection}
                onClickSplitNote={events.onClickSplitNoteFromSelection}
                selection={state.selection}
              />
            </>
          }
        />
      }
    />
  )
};



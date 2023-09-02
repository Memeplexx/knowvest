import { store } from '@/utils/store';
import { CreateIcon, DeleteIcon, DuplicateIcon, OptionText, PopupOption, PopupOptions, SettingsIcon } from '@/utils/styles';
import { type HTMLAttributes } from 'react';
import { ButtonIcon } from '../button-icon';
import { Confirmation } from '../confirmation';
import { Loader } from '../loader';
import LoaderSkeleton from '../loader-skeleton';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Buttons, CardWrapper, Wrapper } from './styles';




export const Active = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { state, refs, ActiveEditor } = inputs;
  return (
    <Wrapper
      {...props}
      children={
        <>
          <CardWrapper
            title="Active"
            actions={
              <Buttons
                children={
                  <>
                    <ButtonIcon
                      showIf={!!state.editorHasText}
                      onClick={outputs.onClickCreateNote}
                      title='Create a new note'
                      aria-label='Create note'
                      children={<CreateIcon />}
                    />
                    <ButtonIcon
                      onClick={outputs.onClickSettingsButton}
                      ref={refs.floating.refs.setReference}
                      aria-label='Settings'
                      children={<SettingsIcon />}
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
              <>
                <ActiveEditor />
                <LoaderSkeleton
                  count={5}
                  isVisible={state.loadingEditor}
                />
              </>
            }
          />
          <Loader
            show={state.loadingNote}
          />
        </>
      }
    />
  )
}

import { CreateIcon, DeleteIcon, DuplicateIcon, OptionText, PopupOption, SettingsIcon, TestIcon } from '@/utils/styles';
import { type HTMLAttributes } from 'react';
import { ButtonIcon } from '../button-icon';
import { Confirmation } from '../confirmation';
import { Loader } from '../loader';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardWrapper, Wrapper } from './styles';
import { Popup } from '../popup';
import Link from 'next/link';



export const Active = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { state, ActiveEditor, store } = inputs;
  return (
    <Wrapper
      {...props}
      children={
        <>
          <CardWrapper
            title="Active"
            actions={
              <>
                <Popup
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
                            <OptionText
                              children='Create new note'
                            />
                            <CreateIcon
                            />
                          </>
                        }
                      />
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
                      <Link
                        href={`/test-config/${state.activeNoteId}`}
                        children={
                          <PopupOption
                            disabled={!state.mayDeleteNote}
                            children={
                              <>
                                <OptionText
                                  children='Create memory test'
                                />
                                <TestIcon
                                />
                              </>
                            }
                          />
                        }
                      />
                    </>
                  }
                />

                <Confirmation
                  showIf={state.confirmDelete}
                  onClose={() => store.activePanel.confirmDelete.$set(false)}
                  onConfirm={outputs.onClickRemoveNote}
                  title='Delete note requested'
                  message='Are you sure you want to delete this note?'
                />

              </>
            }
            body={ActiveEditor ? <ActiveEditor /> : <></>}
            loading={state.loadingEditor}
          />
          <Loader
            showIf={state.loadingNote}
          />
        </>
      }
    />
  )
}

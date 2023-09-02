import { useInputs } from './inputs';
import { Buttons, CardWrapper, Wrapper } from './styles';
import { useOutputs } from './outputs';
import { ButtonIcon } from '../button-icon';
import { Confirmation } from '../confirmation';
import { CreateIcon, DeleteIcon, DuplicateIcon, PopupOption, OptionText, PopupOptions, SettingsIcon } from '@/utils/styles';
import { type HTMLAttributes } from 'react';
import { store } from '@/utils/store';
import { Loader } from '../loader';
import dynamic from 'next/dynamic';
import LoaderSkeleton from '../loader-skeleton';


const ActiveEditor = dynamic(() => import('../active-editor'), {
  ssr: false,
  loading: () => <LoaderSkeleton count={5} />,
});

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
              <ActiveEditor />
            }
          />
          <Loader
            showIf={state.loadingNote}
          />
        </>
      }
    />
  )
}

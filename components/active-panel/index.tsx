"use client";
import { CreateIcon, DeleteIcon, DuplicateIcon, PopupOption, SettingsIcon } from '@/utils/style-utils';
import { type HTMLAttributes } from 'react';
import { ButtonIcon } from '../button-icon';
import { Confirmation } from '../confirmation';
import { Popup } from '../popup';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardWrapper, LoaderPlaceholder, Wrapper } from './styles';
import ActiveEditor from '../active-editor';



export const ActivePanel = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <Wrapper
      {...props}
      children={
        <>
          <CardWrapper
            heading="Active"
            actions={
              <>
                <Popup
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
                  if={inputs.activePanel.confirmDelete}
                  onClose={outputs.onClickCancelRemoveNote}
                  onConfirm={outputs.onClickConfirmRemoveNote}
                  title='Delete note requested'
                  message='Are you sure you want to delete this note?'
                />
              </>
            }
            body={<ActiveEditor />}
            loading={!inputs.stateInitialized}
          />
          <LoaderPlaceholder
            if={inputs.activePanel.loadingNote}
          />
        </>
      }
    />
  )
}

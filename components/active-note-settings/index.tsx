"use client";
import { CreateIcon, DeleteIcon, DuplicateIcon, PopupOption, SettingsIcon } from '@/utils/style-utils';
import { CiCreditCard2 } from 'react-icons/ci';
import { ButtonIcon } from '../button-icon';
import { Confirmation } from '../confirmation';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { SettingsMenuWrapper } from './styles';



export const ActiveNoteSettings = () => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <SettingsMenuWrapper
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
            <PopupOption
              onClick={outputs.onClickCreateFlashCard}
              children={
                <>
                  Create Flash Card
                  <CiCreditCard2 />
                </>
              }
            />
          </>
        }
      />
      <Confirmation
        if={inputs.showConfirmDeleteDialog}
        storeKey='deleteNote'
        onClose={outputs.onClickCancelRemoveNote}
        onConfirm={outputs.onClickConfirmRemoveNote}
        title='Delete note requested'
        message='Are you sure you want to delete this note?'
      />
    </>
  )
}

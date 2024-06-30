"use client";
import { CreateIcon, DeleteIcon, DuplicateIcon, PopupOption, SettingsIcon } from '@/utils/style-utils';
import { CiCreditCard2 } from 'react-icons/ci';
import { ControlButtonIcon } from '../control-button-icon';
import { OverlayConfirmation } from '../overlay-confirmation';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { OverlayNoteActiveWrapper } from './styles';



export const OverlayNoteActive = () => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <OverlayNoteActiveWrapper
        storeKey='settingsMenu'
        ref={inputs.popupRef}
        trigger={props => (
          <ControlButtonIcon
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
      <OverlayConfirmation
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

"use client";
import { PopupOption } from '@/utils/style-utils';
import { CiCirclePlus, CiGrid2V, CiSettings, CiTrash } from 'react-icons/ci';
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
            children={<CiSettings />}
          />
        )}
        overlay={
          <>
            <PopupOption
              onClick={outputs.onClickCreateNote.bind(this)}
              children={
                <>
                  Create new note
                  <CiCirclePlus />
                </>
              }
            />
            <PopupOption
              onClick={outputs.onClickDuplicateNote.bind(this)}
              children={
                <>
                  Duplicate this note
                  <CiGrid2V />
                </>
              }
            />
            <PopupOption
              disabled={!inputs.mayDeleteNote}
              onClick={outputs.onClickRequestDeleteNote.bind(this)}
              children={
                <>
                  Delete this note
                  <CiTrash />
                </>
              }
            />
          </>
        }
      />
      <OverlayConfirmation
        if={inputs.confirmDelete}
        storeKey='deleteNote'
        title='Delete note requested'
        message='Are you sure you want to delete this note?'
        onClose={outputs.onClickCancelRemoveNote.bind(this)}
        onConfirm={outputs.onClickConfirmRemoveNote.bind(this)}
      />
    </>
  )
}

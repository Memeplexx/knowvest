"use client";
import { Portal } from '../control-conditional';
import { Props } from './constants';
import { useOutputs } from './outputs';
import { OverlayModalBackDrop, OverlayModalForeground } from './styles';


export const OverlayModal = (
  props: Props
) => {
  const outputs = useOutputs(props);
  return (
    <Portal
      if={props.if}
      children={
        <OverlayModalBackDrop
          onClick={outputs.onClickBackdrop.bind(this)}
          children={
            <OverlayModalForeground
              children={props.children}
            />
          }
        />
      }
    />
  )
}

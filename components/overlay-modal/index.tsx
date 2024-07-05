"use client";
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Foreground, OverlayModalWrapper } from './styles';


export const OverlayModal = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(props);
  return (
    <OverlayModalWrapper
      if={inputs.showInternal}
      onClickBackdrop={outputs.onClickBackdrop.bind(this)}
      blurBackdrop={true}
      overlay={
        <Foreground
          style={inputs.foregroundAnimations}
          children={props.children}
        />
      }
    />
  )
}


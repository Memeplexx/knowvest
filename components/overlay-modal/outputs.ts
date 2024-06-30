import { MouseEvent } from "react";
import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  return {
    onClickBackdrop: (e: MouseEvent<HTMLDivElement>) => {
      if (inputs.backdropRef.current === e.target)
        props.onBackdropClick?.(e);
    },
  };
};
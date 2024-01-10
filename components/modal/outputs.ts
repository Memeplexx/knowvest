import { MouseEvent } from "react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  return {
    onClickBackdrop: (e: MouseEvent<HTMLDivElement>) => {
      if (inputs.backdropRef.current === e.target) {
        inputs.props.onBackdropClick?.(e);
      }
    },
  };
};
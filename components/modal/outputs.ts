import { MouseEvent } from "react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { props, refs } = inputs;
  return {
    onClickBackdrop: (e: MouseEvent<HTMLDivElement>) => {
      if (refs.backdrop.current === e.target) {
        props.onBackdropClick?.(e);
      }
    },
  };
};
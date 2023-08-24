import { MouseEvent } from "react";
import { State } from "./constants";

export const defineEvents = (hooks: State) => {
  const { props, refs } = hooks;
  return {
    onClickBackdrop: (e: MouseEvent<HTMLDivElement>) => {
      if (refs.backdrop.current === e.target) {
        props.onBackdropClick?.(e);
      }
    },
  };
};
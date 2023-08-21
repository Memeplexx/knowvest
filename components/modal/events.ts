import { MouseEvent } from "react";
import { State } from "./constants";

export const defineEvents = (state: State) => ({
  onClickBackdrop: (e: MouseEvent<HTMLDivElement>) => {
    if (state.backdropRef.current === e.target) {
      state.onBackdropClick?.(e);
    }
  },
});
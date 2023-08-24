import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { state, refs } = inputs;
  return {
    onBodyScroll: () => {
      const isScrollingDown = state.previousScrollOffset.current < refs.body.current!.scrollTop;
      const scrollDiff = refs.body.current!.scrollTop - state.previousScrollOffset.current;
      state.headerOffset.current -= scrollDiff;
      state.headerOffset.current = isScrollingDown ? Math.max(-70, state.headerOffset.current) : Math.min(0, state.headerOffset.current);
      refs.head.current!.style.top = `${state.headerOffset.current}px`;
      state.previousScrollOffset.current = refs.body.current!.scrollTop;
      refs.body.current!.scrollTop > 0
        ? refs.head.current!.style.boxShadow = '0px 3px 5px 0px #000'
        : refs.head.current!.style.boxShadow = '';
    }
  };
}
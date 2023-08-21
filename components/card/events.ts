import { State } from "./constants";

export const useEvents = (state: State) => ({
  onBodyScroll: () => {
    const isScrollingDown = state.previousScrollOffset.current < state.bodyEl.current!.scrollTop;
    const scrollDiff = state.bodyEl.current!.scrollTop - state.previousScrollOffset.current;
    state.headerOffset.current -= scrollDiff;
    state.headerOffset.current = isScrollingDown ? Math.max(-70, state.headerOffset.current) : Math.min(0, state.headerOffset.current);
    state.headEl.current!.style.top = `${state.headerOffset.current}px`;
    state.previousScrollOffset.current = state.bodyEl.current!.scrollTop;
    state.bodyEl.current!.scrollTop > 0
      ? state.headEl.current!.style.boxShadow = '0px 3px 5px 0px #000'
      : state.headEl.current!.style.boxShadow = '';
  }
});
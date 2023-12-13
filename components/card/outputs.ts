import { Inputs } from "./constants";

export const useOutputs = ({ previousScrollOffset, bodyRef, headRef, headerOffset }: Inputs) => {
  return {
    onBodyScroll: () => {
      const isScrollingDown = previousScrollOffset.current < bodyRef.current!.scrollTop;
      const scrollDiff = bodyRef.current!.scrollTop - previousScrollOffset.current;
      headerOffset.current -= scrollDiff;
      headerOffset.current = isScrollingDown ? Math.max(-70, headerOffset.current) : Math.min(0, headerOffset.current);
      headRef.current!.style.top = `${headerOffset.current}px`;
      previousScrollOffset.current = bodyRef.current!.scrollTop;
      bodyRef.current!.scrollTop > 0
        ? headRef.current!.style.boxShadow = '0px 3px 5px 0px #000'
        : headRef.current!.style.boxShadow = '';
    }
  };
}
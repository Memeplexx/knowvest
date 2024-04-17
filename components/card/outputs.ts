import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { previousScrollOffset, bodyRef, headRef, headerOffset } = inputs;
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
      const element = bodyRef.current!;
      if (Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1) {
        props.onScrolledToBottom?.();
      }
    }
  };
}
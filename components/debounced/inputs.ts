import { useRef, useState } from "react";
import { Props } from "./constants";

export const useInputs = (props: Props) => {

  const { onChangeDebounced, debounceTime, ...otherProps } = props;
  const [state, setState] = useState(props.value);
  const valueRef = useRef(state);
  const timestampRef = useRef(0);
  timestampRef.current = Date.now();
  const timeoutRef = useRef<number>(0);
  const actualDebounceTime = debounceTime ?? 500;
  if (state !== valueRef.current) {
    valueRef.current = state;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (Date.now() < (timestampRef.current + actualDebounceTime)) 
        return;
      onChangeDebounced(state);
    }, actualDebounceTime)
  }
  return {
    ...otherProps,
    onChange: (e: React.ChangeEvent<{ value: string }>) => setState(e.target.value),
    value: state,
  }
}

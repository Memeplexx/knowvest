import { useRef, useState } from "react";
import { Props } from "./constants";

export const useInputs = (props: Props) => {

  const { onChangeDebounced, debounceTime, ...otherProps } = props;
  const [value, setValue] = useState(props.value);
  const valueRef = useRef(value);
  const timestampRef = useRef(0);
  timestampRef.current = Date.now();
  const timeoutRef = useRef<number>(0);
  const actualDebounceTime = debounceTime ?? 500;
  if (value !== valueRef.current) {
    valueRef.current = value;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (Date.now() < (timestampRef.current + actualDebounceTime)) { return; }
      onChangeDebounced(value);
    }, actualDebounceTime)
  }
  return {
    ...otherProps,
    onChange: (e: React.ChangeEvent<{ value: string }>) => setValue(e.target.value),
    value,
  }
}

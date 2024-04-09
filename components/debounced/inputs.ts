import { useRecord } from "@/utils/react-utils";
import { useRef } from "react";
import { Props } from "./constants";

export const useInputs = (props: Props) => {

  const { onChangeDebounced, debounceTime, ...otherProps } = props;
  const localState = useRecord({
    value: props.value,
  });
  const valueRef = useRef(localState.value);
  const timestampRef = useRef(0);
  timestampRef.current = Date.now();
  const timeoutRef = useRef<number>(0);
  const actualDebounceTime = debounceTime ?? 500;
  if (localState.value !== valueRef.current) {
    valueRef.current = localState.value;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (Date.now() < (timestampRef.current + actualDebounceTime)) { return; }
      onChangeDebounced(localState.value);
    }, actualDebounceTime)
  }
  return {
    ...otherProps,
    onChange: (e: React.ChangeEvent<{ value: string }>) => localState.set({value: e.target.value }),
    ...localState,
  }
}

"use client";

import { useDebounce } from "@/utils/hooks";
import { TextareaHTMLAttributes, useState } from "react";

export const TextAreaDebounced = (
  {
    debounceTime = 500,
    ...props
  }: {
    value: string,
    onChangeDebounced: (value: string) => void,
    debounceTime?: number
  } & TextareaHTMLAttributes<unknown>
) => {
  const { onChangeDebounced, ...otherProps } = props;
  const [value, setValue] = useState(props.value);
  useDebounce(value, debounceTime, () => onChangeDebounced(value));
  return (
    <textarea
      {...otherProps}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}
import { type HTMLAttributes } from 'react';
import { useInputs } from "./inputs";

export type Props = HTMLAttributes<HTMLDivElement>

export type Inputs = ReturnType<typeof useInputs>;

export const initialState = {
  index: 0,
}

export const pageSize = 10;

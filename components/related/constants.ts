import { NoteId } from "@/actions/types";
import { type HTMLAttributes } from 'react';
import { useInputs } from "./inputs";

export type Props = {
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>

export const initialState = {
  index: 0,
}

export const pageSize = 10;

export type Inputs = ReturnType<typeof useInputs>;
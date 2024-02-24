import { NoteId } from "@/actions/types";
import { useInputs } from "./inputs";
import { type HTMLAttributes } from 'react';

export type Props = {
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>

export const initialState = {
  relatedItems: {
    index: 0,
  }
}

export const pageSize = 10;

export type Inputs = ReturnType<typeof useInputs>;
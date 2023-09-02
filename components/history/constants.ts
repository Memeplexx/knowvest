import { NoteId } from "@/server/dtos";
import { useInputs } from "./inputs";
import { type HTMLAttributes } from 'react';

export type Props = {
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>

export const historyInitialState = {
  loadingNotes: false,
};

export type Inputs = ReturnType<typeof useInputs>;
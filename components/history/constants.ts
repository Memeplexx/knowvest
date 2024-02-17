import { NoteId } from "@/utils/types";
import { useInputs } from "./inputs";
import { type HTMLAttributes } from 'react';

export type Props = {
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>;

export type Inputs = ReturnType<typeof useInputs>;

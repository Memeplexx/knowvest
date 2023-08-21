import { NoteId } from "@/server/dtos";
import { useHooks } from "./hooks";
import { HTMLAttributes } from 'react';

export type Props = {
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>

export type State = ReturnType<typeof useHooks>;
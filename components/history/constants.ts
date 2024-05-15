import { useInputs } from "./inputs";
import { type HTMLAttributes } from 'react';
import { Store } from "olik";
import { AppState } from "@/utils/store-utils";
import { NoteId } from "@/actions/types";

export type Props = {
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>

export type Inputs = ReturnType<typeof useInputs>;

export const initialState = {
  index: 0,
}

export const pageSize = 10;

export type HistoryItemsStore = Store<AppState & { historyItems: typeof initialState }>;

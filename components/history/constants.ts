import { NoteId } from "@/actions/types";
import { AppState } from "@/utils/store-utils";
import { Store } from "olik";
import { type HTMLAttributes } from 'react';
import { useInputs } from "./inputs";

export type Props = {
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>

export type Inputs = ReturnType<typeof useInputs>;

export const initialState = {
  index: 0,
}

export const pageSize = 10;

export type HistoryItemsStore = Store<AppState & { historyItems: typeof initialState }>;

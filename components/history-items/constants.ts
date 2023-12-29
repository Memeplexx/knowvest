import { NoteId } from "@/server/dtos";
import { useInputs } from "./inputs";
import { type HTMLAttributes, RefObject } from 'react';
import { Store } from "olik";
import { AppState } from "@/utils/constants";

export type Props = {
  innerRef: RefObject<HistoryItemsHandle>,
  onSelectNote: (noteId: NoteId) => void;
} & HTMLAttributes<HTMLDivElement>

export const tag = 'historyItemsComponent';

export type Inputs = ReturnType<typeof useInputs>;

export type HistoryItemsHandle = {
  onScrollToBottom: () => void;
};

export const initialState = {
  index: 0,
}

export const pageSize = 10;

export type HistoryItemsStore = Store<AppState & { historyItems: typeof initialState }>;

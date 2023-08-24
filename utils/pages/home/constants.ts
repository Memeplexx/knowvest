import { createContext } from "react";
import { useHooks } from "./hooks";
import { Group, Note, NoteTag, SynonymGroup, Tag } from "@/server/dtos";
import { snackbarStatus } from "@/components/snackbar/constants";

export const homeInitialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
};

export type ServerSideProps = {
  tags: Tag[],
  notes: Note[],
  noteTags: NoteTag[],
  groups: Group[],
  synonymGroups: SynonymGroup[],
}

export type State = ReturnType<typeof useHooks>;

interface NotificationContextType {
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const initialTransientState = {
  message: '',
  status: 'info' as snackbarStatus,
};
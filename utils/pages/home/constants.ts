import { createContext } from "react";
import { useHooks } from "./hooks";
import { GroupDTO, NoteDTO, NoteTagDTO, SynonymGroupDTO, TagDTO } from "@/server/dtos";
import { snackbarStatus } from "@/components/snackbar/constants";

export const homeInitialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
};

export type ServerSideProps = {
  tags: TagDTO[],
  notes: NoteDTO[],
  noteTags: NoteTagDTO[],
  groups: GroupDTO[],
  synonymGroups: SynonymGroupDTO[],
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
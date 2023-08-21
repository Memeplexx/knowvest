import { createContext } from "react";
import { useHooks } from "./hooks";
import { Group, Note, NoteTag, SynonymGroup, Tag } from "@/server/dtos";
import { snackbarStatus } from "@/components/snackbar/constants";
import { Store } from "olik";
import { AppStoreState } from "@/utils/types";

export const initialState = {
  homeComponent: {
    historyExpanded: false,
    similarExpanded: false,
    tagsExpanded: false,
    headerExpanded: true,
  }
};

export type ServerSideProps = {
  tags: Tag[],
  notes: Note[],
  noteTags: NoteTag[],
  groups: Group[],
  synonymGroups: SynonymGroup[],
}

export type State = ReturnType<typeof useHooks>;

interface HomeContextType {
  notifyError: (message: string) => void;
  notifySuccess: (message: string) => void;
  notifyInfo: (message: string) => void;
}

export const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const OlikContext = createContext<Store<AppStoreState> | undefined>(undefined);

export const initialTransientState = {
  message: '', 
  status: 'info' as snackbarStatus,
};
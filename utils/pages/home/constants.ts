import { createContext } from "react";
import { useInputs } from "./inputs";
import { snackbarStatus } from "@/components/snackbar/constants";


export const initialState = {
  home: {
    historyExpanded: false,
    similarExpanded: false,
    tagsExpanded: false,
    headerExpanded: true,
  }
};

export type State = ReturnType<typeof useInputs>;

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
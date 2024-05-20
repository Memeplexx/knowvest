import { ReactNode, createContext } from "react";
import { useInputs } from "./inputs";
import { SuccessIcon, FailureIcon, InfoIcon } from "./styles";

interface NotificationContextType {
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export type Inputs = ReturnType<typeof useInputs>;


export const snackbarStatuses = {
  success: { icon: () => <SuccessIcon/>, color: '#50C878' },
  error: { icon: () => <FailureIcon/>, color: '#F00' },
  info: { icon: () => <InfoIcon/>, color: '#FF5F1F' },
}

export type snackbarStatus = keyof typeof snackbarStatuses;

export type Message = {
  text: string,
  ts: number,
  show: boolean
};

export type Props = {
  storeKey: string,
  stackGap?: number,
  displayDuration?: number,
  animationDuration?: number,
  maxCount?: number,
  renderMessage?: (message: string) => ReactNode,
  children: React.ReactNode,
};

export const defaultProps = {
  displayDuration: 3000,
  animationDuration: 200,
  stackGap: 80,
  maxCount: 5,
} satisfies Partial<Props>;

export const initialState = {
  message: '',
  status: 'info' as snackbarStatus,
  messages: new Array<Message>(),
}

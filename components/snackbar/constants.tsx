import { ReactNode } from "react";
import { FailureIcon, InfoIcon, SuccessIcon } from "./styles";

export const snackbarStatuses = {
  success: { icon: () => <SuccessIcon/>, color: '#50C878' },
  error: { icon: () => <FailureIcon/>, color: '#F00' },
  info: { icon: () => <InfoIcon/>, color: '#FF5F1F' },
}

export type snackbarStatus = keyof typeof snackbarStatuses;

export type Props = {
  message: string,
  status: snackbarStatus,
  duration?: number,
  stackGap?: number,
  animationDuration?: number,
  renderMessage?: (message: string) => ReactNode,
  onMessageClear: () => void,
};

export const defaultProps = {
  duration: 3000,
  animationDuration: 200,
  stackGap: 80,
  message: '',
  status: 'info',
} satisfies Partial<Props>;

export const initialState = {
  messages: new Array<{ text: string, ts: number, show: boolean }>(),
};


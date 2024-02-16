import { State } from "./constants";

export const useOutputs = ({ state }: State) => ({
  onNotifyError: (message: string) => {
    state.set({
      message,
      status: 'error',
    });
  },
  onNotifySuccess: (message: string) => {
    state.set({
      message,
      status: 'success',
    });
  },
  onNotifyInfo: (message: string) => {
    state.set({
      message,
      status: 'info',
    });
  },
  onMessageClear: () => {
    state.set({ message: '' });
  }
});
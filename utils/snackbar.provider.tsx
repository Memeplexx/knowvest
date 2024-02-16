"use client";
import { snackbarStatus } from '@/components/snackbar/constants';
import { NotificationContext } from '@/utils/constants';
import { useRecord } from './hooks';


export default function SnackBarProvider({ children }: { children: React.ReactNode }) {
  const state = useRecord({
    message: '',
    status: 'info' as snackbarStatus,
  });
  const onNotifyError = (message: string) => {
    state.set({
      message,
      status: 'error',
    });
  };
  const onNotifySuccess = (message: string) => {
    state.set({
      message,
      status: 'success',
    });
  };
  const onNotifyInfo = (message: string) => {
    state.set({
      message,
      status: 'info',
    });
  };
  return (
    <NotificationContext.Provider
      value={{
        error: onNotifyError,
        success: onNotifySuccess,
        info: onNotifyInfo,
      }}
      children={children}
    />
  );
}
"use client";
import { useContext } from "react"
import { NotificationContext } from "./constants";
import { useRecord } from '../../utils/hooks';
import { useEffect } from 'react';
import { snackbarStatus } from './snackbar/constants';
import { Snackbar } from './snackbar';
import { createPortal } from "react-dom";

export const useNotifier = () => {
  return useContext(NotificationContext)!;
}

export function NotifierProvider({ children }: { children: React.ReactNode }) {
  const state = useRecord({
    message: '',
    status: 'info' as snackbarStatus,
    initialized: false,
  });
  const update = (status: snackbarStatus, message: string) => state.set({ message, status })
  const onNotifyError = (message: string) => update('error', message);
  const onNotifySuccess = (message: string) => update('success', message);
  const onNotifyInfo = (message: string) => update('info', message);
  useEffect(() => {
    state.set({ initialized: true });
  }, [state]);
  return (
    <>
      <NotificationContext.Provider
        value={{
          error: onNotifyError,
          success: onNotifySuccess,
          info: onNotifyInfo,
        }}
        children={children}
      />
      {!state.initialized ? <></> : createPortal(
        <Snackbar
          message={state.message}
          status={state.status}
          onMessageClear={() => state.set({ message: '' })}
        />,
        document.body)}
    </>
  );
}
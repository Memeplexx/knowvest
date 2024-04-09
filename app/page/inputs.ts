import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useNotifier } from "@/components/notifier";
import { useRecord } from "@/utils/react-utils";

export const useInputs = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const notifier = useNotifier();

  const localState = useRecord({
    showLoader: false,
    initialized: false,
  });

  useEffect(() => {
    localState.set({ initialized: true });
  }, [localState]);

  const notify = useRef(() => {
    notifier.info('Your session expired. Please sign in again');
  });

  useEffect(() => {
    if (!localState.initialized || !searchParams?.has('session-expired')) { return; }
    router.replace('/');
    notify.current();
  }, [searchParams, localState.initialized, router]);

  return localState;
}
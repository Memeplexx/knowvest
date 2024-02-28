import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useNotifier } from "@/components/notifier";

export const useInputs = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const notifier = useNotifier();

  const [state, setState] = useState({
    showLoader: false,
    initialized: false,
  });

  useEffect(() => {
    setState(s => ({ ...s, initialized: true }));
  }, []);

  const notify = useRef(() => {
    notifier.info('Your session expired. Please sign in again');
  });

  useEffect(() => {
    if (!state.initialized || !searchParams?.has('session-expired')) { return; }
    router.replace('/');
    notify.current();
  }, [searchParams, state.initialized, router]);

  return {
    ...state,
    setState,
  };
}
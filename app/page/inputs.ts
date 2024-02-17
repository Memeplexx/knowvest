import { useRecord } from "@/utils/hooks";
import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export const useInputs = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const state = useRecord({
    message: '',
    showLoader: false,
    initialized: false,
  });

  useEffect(() => {
    state.set({ initialized: true });
  }, [state]);

  useEffect(() => {
    if (state.initialized && searchParams?.has('session-expired')) {
      state.set({ message: 'Your session expired. Please sign in again' });
      router.replace('/');
    }
  }, [searchParams, state, state.initialized, router]);

  return state;
}
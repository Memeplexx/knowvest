import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export const useInputs = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState({
    message: '',
    showLoader: false,
    initialized: false,
  });

  useEffect(() => {
    setState(s => ({ ...s, initialized: true }));
  }, [state]);

  useEffect(() => {
    if (state.initialized && searchParams?.has('session-expired')) {
      setState(s => ({ ...s, message: 'Your session expired. Please sign in again' }));
      router.replace('/');
    }
  }, [searchParams, state, state.initialized, router]);

  return {
    ...state,
    setState,
  };
}
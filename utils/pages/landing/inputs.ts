import { useRecord } from "@/utils/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useInputs = () => {

  const state = useRecord({
    message: '',
    showLoader: false,
  })

  const router = useRouter();

  useEffect(() => {
    if (router.query['session-expired']) {
      state.set({ message: 'Your session expired. Please sign in again' });
    }
  }, [router.query, state]);

  return {
    state,
  }
}
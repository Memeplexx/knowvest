import { useRecord } from "@/utils/hooks";
import { getProviders } from "next-auth/react";
import { useEffect } from "react";

export const useInputs = () => {

  const state = useRecord({
    showLoader: false,
    providers: {} as NonNullable<Awaited<ReturnType<typeof getProviders>>>,
  });

  useEffect(() => {
    getProviders().then(providers => state.set({ providers: providers! })).catch(console.error);
  }, [state]);

  return state;
}
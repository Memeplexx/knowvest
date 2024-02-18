import { useRecord } from "@/utils/hooks";
import { getProviders } from "next-auth/react";
import { useEffect } from "react";

export const useInputs = () => {

  const state = useRecord({
    showLoader: false,
    providers: new Array<{ id: string, name: string }>(),
  });

  useEffect(() => {
    getProviders().then(providers => {
      state.set({ providers: Object.entries(providers!).map(([id, provider]) => ({ id, name: provider.name })) });
    }).catch(console.error);
  }, [state]);

  return state;
}
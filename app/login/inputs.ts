import { getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

export const useInputs = () => {

  const [state, setState] = useState({
    showLoader: false,
    providers: new Array<{ id: string, name: string }>(),
  });

  useEffect(() => {
    getProviders().then(providers => {
      setState(s => ({ ...s, providers: Object.entries(providers!).map(([id, provider]) => ({ id, name: provider.name })) }));
    }).catch(console.error);
  }, []);

  return {
    ...state,
    setState,
  };
}
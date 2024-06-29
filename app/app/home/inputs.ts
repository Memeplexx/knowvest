import { useStore } from "@/utils/store-utils";


export const useInputs = () => {
  const { store, state: { isMobileWidth } } = useStore();
  return {
    store,
    isMobileWidth,
  };
}

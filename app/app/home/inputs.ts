import { useStore } from "@/utils/store-utils";


export const useInputs = () => {
  const { store, state: { mediaQuery } } = useStore();
  const isMobileWidth = mediaQuery === 'xs' || mediaQuery === 'sm';
  return {
    store,
    isMobileWidth,
  };
}

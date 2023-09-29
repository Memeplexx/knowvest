import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { state } = inputs;
  return {
    onClickBackdrop: () => {
      // state.setShowIf(false);
      state.set({ show: false });
    },
    onClickTrigger: () => {
      // state.setShowIf(true);
      state.set({ show: true });
    }
  };
};
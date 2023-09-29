import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { state } = inputs;
  return {
    onClickBackdrop: () => {
      state.set({ show: false });
    },
    onClickTrigger: () => {
      state.set({ show: true });
    }
  };
};
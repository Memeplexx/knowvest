import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  return {
    onClickBackdrop: () => {
      inputs.set({ show: false });
    },
    onClickTrigger: () => {
      inputs.set({ show: true });
    }
  };
};
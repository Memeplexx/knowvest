import { Inputs } from "./constants";

export const useOutputs = (
  inputs: Inputs
) => {
  return {
    onClickBackdrop: () => {
      inputs.local.show.$set(false);
    },
    onClickTrigger: () => {
      inputs.local.show.$set(true);
    }
  };
};
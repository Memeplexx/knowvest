import { Inputs, Props } from "./constants";

export const useOutputs = (
  props: Props,
  inputs: Inputs
) => {
  return {
    onClickBackdrop: () => {
      inputs.store.$local.show.$set(false);
    },
    onClickTrigger: () => {
      inputs.store.$local.show.$set(true);
    }
  };
};
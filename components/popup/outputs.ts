import { Inputs, Props } from "./constants";

export const useOutputs = (
  props: Props,
  inputs: Inputs
) => {
  return {
    onClickBackdrop: () => {
      inputs.localStore.show.$set(false);
    },
    onClickTrigger: () => {
      inputs.localStore.show.$set(true);
    }
  };
};
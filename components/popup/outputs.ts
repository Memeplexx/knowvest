import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  return {
    onClickBackdrop: () => {
      inputs.setState(s => ({ ...s, show: false }));
    },
    onClickTrigger: () => {
      inputs.setState(s => ({ ...s, show: true }));
    }
  };
};
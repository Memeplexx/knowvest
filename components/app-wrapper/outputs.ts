import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => ({
  onShowDrawer: (show: boolean) => {
    inputs.local.showDrawer.$set(show);
  }
})
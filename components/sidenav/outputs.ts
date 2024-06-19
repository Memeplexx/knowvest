import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => ({
  onClickMainOverlay: () => {
    inputs.api.start({ x: 0, y: 0 });
    inputs.props.onShow(false);
  }
})
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => ({
  error: (message: string) => inputs.store.$local.$patch({ status: 'error', message }),
  success: (message: string) => inputs.store.$local.$patch({ status: 'success', message }),
  info: (message: string) => inputs.store.$local.$patch({ status: 'info', message }),
})
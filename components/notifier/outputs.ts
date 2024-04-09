import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => ({
  error: (message: string) => inputs.set({ status: 'error', message }),
  success: (message: string) => inputs.set({ status: 'success', message }),
  info: (message: string) => inputs.set({ status: 'info', message }),
})
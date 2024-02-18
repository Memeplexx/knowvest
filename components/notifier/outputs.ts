import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => ({
  error: (message: string) => inputs.set(s => ({ ...s, status: 'error', message })),
  success: (message: string) => inputs.set(s => ({ ...s, status: 'success', message })),
  info: (message: string) => inputs.set(s => ({ ...s, status: 'info', message })),
})
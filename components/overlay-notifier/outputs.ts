import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { local } = inputs;
  return {
    error: (message: string) => {
      local.$patch({ status: 'error', message })
    },
    success: (message: string) => {
      local.$patch({ status: 'success', message })
    },
    info: (message: string) => {
      local.$patch({ status: 'info', message })
    },
  }
}
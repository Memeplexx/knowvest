import { useRecord } from "@/utils/hooks";

export const useInputs = () => {

  const state = useRecord({
    message: '',
    showLoader: false,
  })

  return {
    state,
  }
}
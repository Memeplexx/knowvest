import { snackbarStatus } from "@/components/snackbar/constants";
import { useInputs } from "./inputs";

export const initialTransientState = {
  message: '',
  status: 'info' as snackbarStatus,
};

export type State = ReturnType<typeof useInputs>;

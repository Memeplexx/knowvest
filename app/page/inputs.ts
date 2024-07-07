import { useNotifier } from "@/components/overlay-notifier";
import { useLocalStore } from "@/utils/store-utils";
import { useSearchParams } from "next/navigation";

export const useInputs = () => {

  const { local, state } = useLocalStore('page', { showLoader: false, notificationShown: false })
  const notifier = useNotifier();
  const searchParams = useSearchParams();
  if (searchParams?.has('session-expired') && !state.notificationShown) {
    setTimeout(() => notifier.info('Your session expired. Please sign in again'));
    local.notificationShown.$set(true);
  }

  return {
    ...state,
    local,
  };
}
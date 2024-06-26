import { useNotifier } from "@/components/overlay-notifier";
import { useComponent } from "@/utils/react-utils";
import { useLocalStore } from "@/utils/store-utils";
import { useRouter, useSearchParams } from 'next/navigation';

export const useInputs = () => {

  const { local, state } = useLocalStore('page', { showLoader: false })
  const router = useRouter();
  const searchParams = useSearchParams();
  const notifier = useNotifier();
  const component = useComponent();
  if (component.isMounted && searchParams?.has('session-expired')) {
    router.replace('/');
    notifier.info('Your session expired. Please sign in again');
  }

  return {
    ...state,
    local,
  };
}
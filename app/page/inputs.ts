import { useNotifier } from "@/components/notifier";
import { useLocalStore } from "@/utils/store-utils";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from "react";

export const useInputs = () => {

  const { local, state: { initialized } } = useLocalStore('page', {
    showLoader: false,
    initialized: false,
  })

  const router = useRouter();
  const searchParams = useSearchParams();
  const notifier = useNotifier();

  useEffect(() => {
    local.initialized.$set(true);
  }, [local]);

  useEffect(() => {
    if (!initialized || !searchParams?.has('session-expired')) return;
    router.replace('/');
    notifier.info('Your session expired. Please sign in again');
  }, [searchParams, initialized, router, notifier]);

  return {
    ...local.$state,
    local,
  };
}
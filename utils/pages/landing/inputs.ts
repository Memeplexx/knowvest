import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useInputs = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (router.query['session-expired']) {
      setMessage('Your session expired. Please sign in again');
    }
  }, [router.query]);
  return {
    message,
    setMessage,
  }
}
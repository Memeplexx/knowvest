"use client";
import { Loader } from "@/components/loader";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export const LoginEvents = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const clickListener = async (event: MouseEvent) => {
      const providerId = (event.target as HTMLElement).closest('[data-provider-id]')?.getAttribute('data-provider-id');
      if (!providerId) return;
      setLoading(true);
      await signIn(providerId);
    }
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, [])
  return (
    <Loader
      if={loading}
    />
  )
}
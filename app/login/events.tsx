"use client";
import { Loader } from "@/components/loader";
import { useComponent } from "@/utils/react-utils";
import { signIn } from "next-auth/react";
import { useState } from "react";

export const LoginEvents = () => {
  const [loading, setLoading] = useState(false);
  const component = useComponent();
  component.listen = () => {
    const clickListener = async (event: MouseEvent) => {
      const providerId = (event.target as HTMLElement).closest('[data-provider-id]')?.getAttribute('data-provider-id');
      if (!providerId) return;
      setLoading(true);
      await signIn(providerId);
    }
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }
  return (
    <Loader
      if={loading}
    />
  )
}
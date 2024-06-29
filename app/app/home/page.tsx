"use client";
import { ActiveNote } from "@/components/active-note";
import { HomeDesktop } from "@/components/home-desktop";
import { useStore } from "@/utils/store-utils";

export default function Page() {
  const { state: { isMobileWidth } } = useStore();
  if (isMobileWidth)
    return <ActiveNote />;
  return <HomeDesktop />;
}

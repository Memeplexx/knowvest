"use client";
import { ActiveNote } from "@/components/active-note";
import { HomeDesktop } from "@/components/home-desktop";
import { useStore } from "@/utils/store-utils";
import styled from "styled-components";

export default function Page() {
  const { isMobileWidth } = useStore();
  if (isMobileWidth)
    return <MobileDesktop />;
  return <HomeDesktop />;
}

const MobileDesktop = styled(ActiveNote)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

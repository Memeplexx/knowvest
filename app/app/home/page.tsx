"use client";
import { PanelHomeDesktop } from "@/components/panel-home-desktop";
import { PanelNoteActive } from "@/components/panel-note-active";
import { useStore } from "@/utils/store-utils";
import styled from "styled-components";

export default function Page() {
  const { isMobileWidth } = useStore();
  return isMobileWidth ? <MobileDesktop /> : <PanelHomeDesktop />;
}

const MobileDesktop = styled(PanelNoteActive)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

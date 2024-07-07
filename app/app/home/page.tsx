"use client";
import { OverlayNoteActive } from "@/components/overlay-note-active";
import { PanelHomeDesktop } from "@/components/panel-home-desktop";
import { HeaderAction } from "@/components/panel-navbar";
import { PanelNoteActive } from "@/components/panel-note-active";
import { useStore } from "@/utils/store-utils";
import styled from "styled-components";

export default function Page() {
  const { isMobileWidth } = useStore();
  if (isMobileWidth)
    return (
      <>
        <PanelNoteActiveWrapper />
        <HeaderAction
          children={<OverlayNoteActive />}
        />
      </>
    );
  return (
    <PanelHomeDesktop />
  );
}

const PanelNoteActiveWrapper = styled(PanelNoteActive)`
  background-image: linear-gradient(to right, #131313, #212121);
  height: fit-content;
  min-height: calc(100% - 64px);
`;

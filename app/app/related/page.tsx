"use client";
import { OverlayNotesRelated } from "@/components/overlay-notes-related";
import { HeaderAction } from "@/components/panel-navbar";
import { PanelNotesRelated } from "@/components/panel-notes-related";
import styled from "styled-components";

export default function Page() {
  return (
    <>
      <PanelNotesRelatedWrapper />
      <HeaderAction
        children={<OverlayNotesRelated />}
      />
    </>
  );
}

const PanelNotesRelatedWrapper = styled(PanelNotesRelated)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

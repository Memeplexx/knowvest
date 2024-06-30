"use client";
import { PanelNotesRelated } from "@/components/panel-notes-related";
import styled from "styled-components";

export default function Page() {
  return <PanelNotesRelatedWrapper />;
}

const PanelNotesRelatedWrapper = styled(PanelNotesRelated)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

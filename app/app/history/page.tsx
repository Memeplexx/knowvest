"use client";
import { PanelNotesPrevious } from "@/components/panel-notes-previous";
import styled from "styled-components";

export default function Page() {
  return <PanelNotesPreviousWrapper />;
}

const PanelNotesPreviousWrapper = styled(PanelNotesPrevious)`
  background-image: linear-gradient(to right, #131313, #212121);
`;
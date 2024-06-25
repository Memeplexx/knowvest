"use client";
import { ActiveNoteFlashCards } from "@/components/active-note-flash-cards";
import { ActivePanel } from "@/components/active-panel";
import { ButtonIcon } from "@/components/button-icon";
import { Tabs } from "@/components/card-with-tabs";
import { History } from "@/components/history";
import { element } from "@/components/html";
import { Related } from "@/components/related";
import { mobileBreakPoint } from "@/utils/style-utils";
import styled from "styled-components";

const gap = '4px';

export const HomeWrapper = styled.div`
  min-height: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: ${gap};
  flex: 1;
  height: auto;
  position: relative;
  @media (min-width: ${mobileBreakPoint}) {
    margin: ${gap};
  }
  > * {
    flex: 1;
  }
`;

const BaseToggleButton = styled(ButtonIcon) <{ selected?: boolean }>`
  width: 32px;
  height: 32px;
  position: fixed;
  z-index: 8;
  background-color: ${p => p.selected ? '#FFF' : '#000'};
  color: ${p => p.selected ? '#000' : '#FFF'};
  transition: 0.4s transform;
  border-radius: 50%;
  border: 1px solid #4d4d4d;
  &:not(:hover) {
    opacity: 0.3;
  }
  @media (min-width: ${mobileBreakPoint}) {
    display: none!important;
  }
`;

export const ActivePane = styled(ActivePanel)`
  flex: 1;
  overflow-y: auto;
`;

export const FlashCardPane = styled(element(ActiveNoteFlashCards))`
`;

export const TabsPanel = styled(element(Tabs))`
  transition: transform 0.2s ease-out;
  flex: 1;
`;

export const HistoryPanel = styled(element(History))`
`;

export const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  z-index: 1;
  position: relative;
  @media (min-width: ${mobileBreakPoint}) {
    row-gap: ${gap};
  }
`;

export const RelatedPanel = styled(element(Related))`
`;

"use client";
import { ActivePanel } from "@/components/active-panel";
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

export const ActivePane = styled(ActivePanel)`
  flex: 1;
  overflow-y: auto;
`;

export const HistoryPanel = styled(element(History))`
`;

export const RelatedPanel = styled(element(Related))`
`;

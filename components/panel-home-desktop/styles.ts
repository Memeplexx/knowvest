"use client";
import { div } from "@/components/html";
import { mobileBreakPoint, panelGap } from "@/utils/style-utils";
import styled from "styled-components";
import { ContainerWithStickyHeader } from "../container-with-sticky-header";
import { Tags } from "../tags";


export const PanelHomeDesktopWrapper = styled.div`
  min-height: 0;
  display: flex;
  gap: ${panelGap};
  flex: 1;
  height: auto;
  position: relative;
  @media (min-width: ${mobileBreakPoint}) {
    margin: ${panelGap};
  }
  > * {
    flex: 1;
  }
`;

export const ActivePanel = styled(ContainerWithStickyHeader)`
  background-image: linear-gradient(to left, #202020, #2f2e2e);
`;

export const HistoryPanel = styled(ContainerWithStickyHeader)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

export const RelatedPanel = styled(ContainerWithStickyHeader)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

const Header = styled(div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  color: #ffffff;
  font-weight: 400;
  font-size: 19px;
  letter-spacing: 4px;
  padding: 16px;
`;

export const HistoryHeader = styled(Header)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

export const RelatedHeader = styled(Header)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

export const ActiveHeader = styled(Header)`
  background-image: linear-gradient(to left, #202020, #2f2e2e);
`;

export const FilterPopup = styled(Tags)`
  padding: 8px;
`;
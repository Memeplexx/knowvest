"use client";
import { div } from "@/components/html";
import { mobileBreakPoint, panelGap } from "@/utils/style-utils";
import styled from "styled-components";
import { ContainerWithStickyHeader } from "../container-with-sticky-header";
import { Tags } from "../tags";


export const HomeWrapper = styled.div`
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
`;

export const HistoryPanel = styled(ContainerWithStickyHeader)`
`;

export const RelatedPanel = styled(ContainerWithStickyHeader)`
`;

export const Header = styled(div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  color: #ffffff;
  transition: box-shadow 0.4s;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 67px;
  z-index: 5;
  font-weight: 400;
  font-size: 19px;
  letter-spacing: 4px;
  background-image: linear-gradient(to right, #242020, #191919);
  padding: 16px;
`;

export const FilterPopup = styled(Tags)`
  padding: 8px;
`;
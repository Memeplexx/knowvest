import Link from "next/link";
import styled, { css } from "styled-components";
import { ContainerWithSideNav } from "../container-with-side-nav";
import { div, element } from "../control-conditional";
import { OverlayLoader } from "../overlay-loader";
import { PanelNavbar } from "../panel-navbar";


export const TopBar = styled(element(PanelNavbar))`
`;

export const LoaderPlaceholder = styled(OverlayLoader)`
  flex: 1;
  z-index: 9;
  background-image: linear-gradient(to right, #242020, #191919);
`;

export const ContainerOnceLoggedInWrapper = styled(element(ContainerWithSideNav))`
  flex: 1;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 9;
`;

export const MenuContent = styled(div) <{ $headerHeight: number }>`
  padding-top: 30px;
  background-image: linear-gradient(to right, #101010, #1d1d1d);
  color: #b4b4b4;
  height: 100%;
  border-right: 0.2px solid #5a5a5a;
  overflow-y: auto;
  margin-top: ${p => p.$headerHeight}px;
`;

export const MenuItem = styled(div) <{ $active?: boolean }>`
  padding: 12px 28px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  display: flex;
  gap: 12px;
  align-items: center;
  svg {
    width: 24px;
    height: 24px;
    path {
      stroke: inherit;
    }
  }
`;

export const MenuItemLink = styled(Link) <{ $active?: boolean }>`
  padding: 12px 28px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  svg {
    width: 24px;
    height: 24px;
    path {
      stroke: inherit;
    }
  }
  ${p => p.$active && css`
    background-color: black;
    border-right: 2px solid white;
  `}
`;

export const MenuItemSeparator = styled(div)`
  height: 30px;
`;


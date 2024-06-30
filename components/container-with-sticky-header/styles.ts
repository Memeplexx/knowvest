import { panelGap } from "@/utils/style-utils";
import { CgMenuGridO } from "react-icons/cg";
import styled from "styled-components";
import { button, div, element } from "../control-conditional";


export const ContainerWithStickyHeaderWrapper = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const HamburgerButton = styled(button)`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

export const HamburgerIcon = styled(element(CgMenuGridO))`
  width: 100%;
  height: 100%;
`;

export const StickyHeader = styled(div)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
`;

export const Body = styled(div) <{ $headerHeight: number }>`
  flex: 1;
  display: flex;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  > :first-child {
    margin-top: calc(${p => p.$headerHeight}px + ${panelGap});
    flex: 1;
  } 
`;

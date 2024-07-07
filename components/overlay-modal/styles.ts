import { mobileBreakPoint } from "@/utils/style-utils";
import { animated } from "react-spring";
import styled from "styled-components";
import { div } from "../control-conditional";



export const OverlayModalBackDrop = styled(div)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 11;
  background-color: rgba(0,0,0,0.2);
  display: flex;
  place-content: center;
`;

export const OverlayModalForeground = styled(animated.div)`
  align-self: center;
  justify-self: center;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right,#212121,#312c2c);
  max-width: calc(100% - 16px);
  max-height: calc(100% - 16px);
  @media (min-width: ${mobileBreakPoint}) {
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0,1.08,.57,.96);
  }
  @media (max-width: ${mobileBreakPoint}) {
    border: 1px solid #4b4b4b;
  }
`;


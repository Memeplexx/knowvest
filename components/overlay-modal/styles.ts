import { Overlay } from "@/utils/style-provider";
import { mobileBreakPoint } from "@/utils/style-utils";
import { animated } from "react-spring";
import styled from "styled-components";



export const OverlayModalWrapper = styled(Overlay)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ForegroundWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  z-index: 5;
  pointer-events: none;
  filter: drop-shadow(0px 0px 15px rgba(0,0,0,1));
`;

export const Foreground = styled(animated.div)`
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


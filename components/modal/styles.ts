import styled from "styled-components";
import { animated } from "react-spring";
import { defaultFontFamily, mobileBreakPoint } from "@/utils/styles";


export const Background = styled(animated.div)`
  background-color: transparent;
  padding: 0;
  border: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.1);
  /* @media (min-width: ${mobileBreakPoint}) { */
    filter: drop-shadow(0px 0px 15px #000);
    backdrop-filter: blur(10px);
  /* } */
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
  z-index: 4;
  pointer-events: none;
`;

export const Foreground = styled(animated.div)`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  ${defaultFontFamily.style};
  background-image: linear-gradient(to right,#212121,#312c2c);
  max-width: calc(100% - 16px);
  max-height: calc(100% - 16px);
  @media (min-width: ${mobileBreakPoint}) {
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0,1.08,.57,.96);
    filter: drop-shadow(0px 0px 38px #000);
  }
  @media (max-width: ${mobileBreakPoint}) {
    border: 1px solid #4b4b4b;
  }
`;


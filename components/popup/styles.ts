import styled from "styled-components";
import { animated } from "react-spring";
import { defaultFontFamily } from "@/utils/style-utils";



export const Floating = styled.div`
  filter: drop-shadow(0px 0px 38px #000);
`;

export const ForegroundWrapper = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.1);
  filter: drop-shadow(0px 0px 15px rgba(0,0,0,0.4));
  backdrop-filter: blur(2px);
`;

export const Foreground = styled(animated.div)`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  ${defaultFontFamily.style};
  background-image: linear-gradient(to right,#212121,#312c2c);
  transform-origin: top right;
  max-width: 400px;
`;


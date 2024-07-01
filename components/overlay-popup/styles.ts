import { animated } from "react-spring";
import styled from "styled-components";



export const Floating = styled.div`
  filter: drop-shadow(0px 0px 38px #000);
`;

export const Foreground = styled(animated.div)`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right,#212121,#312c2c);
  transform-origin: top right;
  max-width: 400px;
`;


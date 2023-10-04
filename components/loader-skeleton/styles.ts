import styled from "styled-components";

export const Wrapper = styled.div<{ $show?: boolean }>`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 1;
  opacity: ${p => p.$show ? 1 : 0};
  pointer-events: ${p => p.$show ? 'all' : 'none'};
  transition: opacity 0.5s;
  position: absolute;
  z-index: 4;
  background-image: linear-gradient(to right, #242020, #191919);
`;
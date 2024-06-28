import { animated } from 'react-spring';
import styled from 'styled-components';
import { Position } from './constants';



export const SideNavWrapper = styled(animated.div) <{ $size: number, $edgeThreshold: number, $position: Position }>`
  position: absolute;
  background-color: transparent;
  z-index: 10;
  touch-action: none;
  display: flex;
  ${p => {
    switch (p.$position) {
      case 'left':
        return `
          left: -${p.$size}px;
          width: ${p.$size + p.$edgeThreshold}px;
          padding-right: ${p.$edgeThreshold}px;
          top: 0;
          bottom: 0;
        `;
      case 'right':
        return `
          right: -${p.$size}px;
          width: ${p.$size + p.$edgeThreshold}px;
          padding-left: ${p.$edgeThreshold}px;
          top: 0;
          bottom: 0;
        `;
      case 'top':
        return `
          top: -${p.$size}px;
          height: ${p.$size + p.$edgeThreshold}px;
          padding-bottom: ${p.$edgeThreshold}px;
          left: 0;
          right: 0;
        `;
      case 'bottom':
        return `
          bottom: -${p.$size}px;
          height: ${p.$size + p.$edgeThreshold}px;
          padding-top: ${p.$edgeThreshold}px;
          left: 0;
          right: 0;
        `;
    }
  }}
`;

export const MenuContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: black;
`;

export const SideNavOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  opacity: ${({ $show }) => $show ? '1' : '0'};
  pointer-events: ${({ $show }) => $show ? 'auto' : 'none'};
`;
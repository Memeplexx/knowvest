import { CiCircleAlert, CiCircleCheck, CiCircleInfo } from 'react-icons/ci';
import styled from "styled-components";
import { snackbarStatus, snackbarStatuses } from './constants';

export const Container = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  pointer-events: none;
  z-index: 1000;
`;

export const Popup = styled.div`
  pointer-events: all;
  ${p => p.theme.fontFamily.default.style};
`;

export const Message = styled.div<{ count: number, index: number, animation: number, gap: number, status: snackbarStatus }>`
  transition: ${p => p.animation}ms all;
  position: absolute;
  transform: translateY(-${p => !p.showIf ? 0 : ((p.index + 1) * p.gap)}px) translateX(-50%);
  background-color: ${p => snackbarStatuses[p.status].color};
  z-index: 1;
  color: #FFF;
  padding: 8px;
  border-radius: 4px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  > svg {
    font-size: 26px;  
  }
`

export const SuccessIcon = styled(CiCircleCheck)`
`;

export const FailureIcon = styled(CiCircleAlert)`
`;

export const InfoIcon = styled(CiCircleInfo)`
`;
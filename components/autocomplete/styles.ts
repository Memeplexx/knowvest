import styled, { css } from 'styled-components';

import { CloseIcon } from '@/utils/style-utils';
import { ButtonIcon } from '../button-icon';
import { button, div, element, input } from '../html';


export const AutocompleteWrapper = styled.div`
  position: relative;
  display: flex;
`;

export const ButtonsWrapper = styled(div)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 8px;
  display: flex;
  z-index: 1;
  align-items: center;
`;

export const ClearTextButton = styled(element(ButtonIcon))`
`;

export const CloseOptionsButton = styled(element(ButtonIcon))`
`;

export const ClearIcon = styled(CloseIcon)`
  pointer-events: none;
  width: auto;
  height: auto;
`;

export const Input = styled(input) <{ $hasError: boolean }>`
  flex: 1;
  outline: none;
  border: 0.5px solid #CCC;
  padding: 11px;
  padding-right: 24px;
  color: #FFF;
  z-index: 1;
  cursor: text;
  &:hover {
    background-color: rgba(255,255,255,0.2);
  }
  :focus {
    background-color: rgba(255,255,255,0.3);
  }
  ::placeholder {
    opacity: 0.4;
  }
  ${p => p.$hasError && `
    border-color: #F00;
  `}
`;

export const ErrorMsg = styled(div)`
  color: #F00;
  position: absolute;
  transition: 0.2s all;
  font-size: 12px;
  ${p => p.if && css`
    bottom: -22px;
  `}
`;

export const Options = styled(div)`
  flex: 1;
  overflow-y: auto;
  z-index: 4;
  filter: drop-shadow(0px 38px 38px #000);
  background-image: linear-gradient(to right,#212121,#312c2c);
  display: flex;
  flex-direction: column;
`;

export const OptionItem = styled(button)`
  padding: 8px;
  color: #c5c5c5;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  &:hover {
    background-color: #272727;
    color: #FFF;
  }
  &:focus {
    background-color: #272727;
    outline: none;
    background-color: #323232;
  }
`;

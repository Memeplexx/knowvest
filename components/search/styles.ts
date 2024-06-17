import { IoMdCloseCircle } from 'react-icons/io';
import styled, { css } from "styled-components";
import { Button } from "../button";
import { ButtonIcon } from "../button-icon";
import { div, element } from "../html";
import ReadonlyNote from "../readonly-note";
import { dialogWidth, tabsHeight } from "./constants";

export const Container = styled(div)`
  width: ${dialogWidth}px;
  height: 600px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  @media (max-width: ${dialogWidth}px) {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
    max-height: calc(100vh - 16px);
  }
`;

export const MainContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 24px;
  max-height: 100%;
  @media (max-width: ${dialogWidth}px) {
    padding: 0;
    width: calc(100vw - 16px);
    max-height: calc(100vh - (${tabsHeight} + 16px));
  }
`;

export const TabsWrapper = styled(div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: ${tabsHeight};
`;

export const TabTitle = styled(div)`
  padding-left: 16px;
`;

export const TabsButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-right: 16px;
`;

export const TabButton = styled(Button)`
`;

export const CloseButton = styled(ButtonIcon)`
`;

export const LeftContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  @media (max-width: ${dialogWidth}px) {
    padding: 16px;
    max-height: 100%;
  }
`;

export const RightContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgba(0,0,0,0.2);
  padding: 16px;
  @media (max-width: ${dialogWidth}px) {
    max-height: 100%;
  }
`;

export const TagsOuterWrapper = styled(div)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
  overflow: visible;
`;

export const TagsWrapper = styled(div)`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 12px;
`;

export const CategoryWrapper = styled(div)`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

export const AutocompleteOption = styled(div)`
  display: flex;
  gap: 8px;
`;

export const Tag = styled(div) <{ $hovered: boolean, $disabled: boolean, $leftMost?: boolean, $rightMost?: boolean, $rightGap?: boolean }>`
  font-size: 12px;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: all 0.2s;
  background-color: #FFF;
  color: #000;
  border-color: rgba(255,255,255,0.2);
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 0;
  border-right-width: 0;
  border-style: solid;
  cursor: pointer;
  ${p => p.$rightGap && css`
    margin-right: 4px;
  `}
  ${p => p.$hovered && css`
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.6);
    border-color: rgba(255,255,255,0.4);
  `}
  ${p => p.$disabled && css`
    background-color: #000;
    color: #FFF;
  `}
  ${p => p.$leftMost && css`
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    padding-left: 8px;
    border-left-width: 1px;
  `}
  ${p => p.$rightMost && css`
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border-right-width: 1px;
    padding: 0;
  `}
`;

export const RemoveButton = styled(ButtonIcon)`
`;

export const RemoveIcon = styled(element(IoMdCloseCircle))`
`;


export const Result = styled(ReadonlyNote)`
  cursor: pointer;
  margin: 0 -16px;
  padding: 16px;
  &:hover {
    background-color: rgba(0,0,0,0.4);
  }
`;
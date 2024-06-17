"use client"
import { Button } from '@/components/button';
import { ButtonIcon } from '@/components/button-icon';
import { div, element } from '@/components/html';
import { Loader } from '@/components/loader';
import ReadonlyNote from '@/components/readonly-note';
import { mobileBreakPoint } from '@/utils/style-utils';
import { IoMdCloseCircle } from 'react-icons/io';
import styled, { css } from "styled-components";

const gap = '4px';


export const BodyWrapper = styled(div)`
  min-height: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: ${gap};
  flex: 1;
  height: auto;
  position: relative;
  @media (min-width: ${mobileBreakPoint}) {
    margin: ${gap};
  }
  > * {
    flex: 1;
  }
`;

export const TabsWrapper = styled(div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: 16px;
  background-image: linear-gradient(to right, #242020, #191919);
`;

export const RightContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgba(0,0,0,0.2);
  padding: 16px;
  background-image: linear-gradient(to right, #242020, #191919);
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

export const LoaderPlaceholder = styled(Loader)`
  z-index: 9;
  background-image: linear-gradient(to right, #242020, #191919);
`;
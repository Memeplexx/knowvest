"use client"
import { Button } from '@/components/button';
import { ButtonIcon } from '@/components/button-icon';
import { div, element } from '@/components/html';
import ReadonlyNote from '@/components/readonly-note';
import { mobileBreakPoint } from '@/utils/style-utils';
import { GiLighthouse } from 'react-icons/gi';
import { IoMdCloseCircle } from 'react-icons/io';
import { WiCloudyWindy } from 'react-icons/wi';
import styled, { css } from "styled-components";

const gap = '4px';


export const SearchWrapper = styled(div)`
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

export const SearchContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 60px;
  background-image: linear-gradient(to right, #242020, #191919);
  @media screen and (max-width: ${mobileBreakPoint}) {
    padding: 8px;
  }
`;

export const ResultsContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgba(0,0,0,0.2);
  padding: 60px;
  background-image: linear-gradient(to right, #242020, #191919);
  @media screen and (max-width: ${mobileBreakPoint}) {
    padding: 16px;
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
  justify-content: space-between;
`;

export const OptionLabel = styled(div)`
`;

export const OptionLabelSuffix = styled(div)`
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

export const BodyGroup = styled(div) <{ $active?: boolean }>`
  flex-direction: column;
  column-gap: 16px;
  row-gap: 8px;
  display: flex;
  padding: 24px;
  margin: 0 -24px;
  pointer-events: all;
  ${p => p.$active && css`
    background-color: rgba(0,0,0,0.1);
  `}
  @media (max-width: ${mobileBreakPoint}) {
    margin: 0;
    padding: 0;
  }
`;

export const BodyHeader = styled(div)`
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 40px;
`;

export const PageTitle = styled.div`
`;

export const NoResultsWrapper = styled(div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: grey;
`;

export const NoResultsIcon = styled(element(WiCloudyWindy))`
  width: 64px;
  height: auto;
`;

export const SearchIcon = styled(element(GiLighthouse))`
  width: 64px;
  height: auto;
`;

export const Footer = styled(div)`
  display: flex;
  background-image: linear-gradient(to right, #131313, #212121);
  padding: 16px 60px;
  justify-content: space-between;
  @media (max-width: ${mobileBreakPoint}) {
    padding: 8px 24px;
  }
`;

export const FooterButton = styled(element(Button))`
`;
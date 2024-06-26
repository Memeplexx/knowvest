"use client"
import { ControlButtonFancy } from '@/components/control-button-fancy';
import { ControlButtonIcon } from '@/components/control-button-icon';
import { div, element } from '@/components/control-conditional';
import { PanelNoteReadonly } from '@/components/panel-note-readonly';
import { mobileBreakPoint, panelGap } from '@/utils/style-utils';
import { AiOutlineLink } from 'react-icons/ai';
import { GiLighthouse } from 'react-icons/gi';
import { IoMdCloseCircle } from 'react-icons/io';
import { WiCloudyWindy } from 'react-icons/wi';
import styled, { css } from "styled-components";


export const PanelSearchNotesWrapper = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${panelGap};
`;

export const SearchPageBody = styled(div)`
  min-height: 0;
  display: flex;
  flex-direction: row;
  gap: ${panelGap};
  flex: 1;
  height: auto;
  position: relative;
  > * {
    flex: 1;
  }
`;

export const SearchContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 60px 120px;
  padding-right: 24px;
  background-image: linear-gradient(to right, #242020, #191919);
  @media screen and (max-width: ${mobileBreakPoint}) {
    padding: 8px 16px;
  }
`;

export const ResultsContent = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgba(0,0,0,0.2);
  padding: 60px 120px;
  padding-left: 24px;
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

export const Tag = styled(div) <{ $hovered: boolean, $disabled: boolean, $leftMost?: boolean, $rightMost?: boolean, $rightGap?: boolean, $type: 'synonym' | 'group' | 'searchTerm' }>`
  font-size: 12px;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: all 0.2s;
  color: #000;
  cursor: pointer;
  ${p => p.$rightGap && css`
    margin-right: 4px;
  `}
  
  ${p => p.$leftMost && css`
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    padding-left: 8px;
  `}
  ${p => p.$rightMost && css`
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 0;
  `}
  ${p => p.$type === 'synonym' && css`
    background-color: #e500e52e;
    outline: 1px solid ${p.$hovered ? '#e500e5' : '#e500e569'};
    color: #ff93ff;
  `}
  ${p => p.$type === 'group' && css`
    background-color: #23ff0017;
    outline: 1px solid ${p.$hovered ? '#23ff00' : '#23ff004a'};
    color: #00ff00;
  `}
  ${p => p.$type === 'searchTerm' && css`
    background-color: #eaff002b;
    outline: 0.5px solid ${p.$hovered ? '#eaff00' : '#eaff005e'};
    color: yellow;
  `}
  ${p => p.$disabled && css`
    background-color: #000;
    color: #FFF;
  `}
`;

export const RemoveButton = styled(ControlButtonIcon)`
`;

export const RemoveIcon = styled(element(IoMdCloseCircle))`
`;

export const ResultWrapper = styled(div)``;

export const Result = styled(PanelNoteReadonly)`
  cursor: pointer;
  padding: 16px 0;
  &:not(:last-of-type) {
    border-bottom: 1px solid #565656;
  }
  &:hover {
    background-color: rgba(0,0,0,0.4);
  }
`;

export const Header = styled(div)`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 4px;
  padding: 0 4px;
  color: #6f6f6f;
  font-size: 10px;
  margin: 0 -16px;
`;

export const Icon = styled(AiOutlineLink)`
  color: #6f6f6f;
  width: 16px;
  height: 16px;
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

export const FooterButton = styled(element(ControlButtonFancy))`
`;
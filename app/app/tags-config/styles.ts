"use client"
import { Button } from '@/components/button';
import { ButtonIcon } from '@/components/button-icon';
import { div, element } from '@/components/html';
import { Loader } from '@/components/loader';
import { defaultFontFamily, mobileBreakPoint } from '@/utils/style-utils';
import styled, { css } from 'styled-components';


export const Wrapper = styled.div`
  min-height: 0;
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  ${defaultFontFamily.style};
  background-color: black;
`;


export const CloseButton = styled(ButtonIcon)`
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

export const SettingsButton = styled(ButtonIcon) <{ $show: boolean }>`
  opacity: ${p => p.$show ? 1 : 0};
`;

export const CustomGroupNameInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  &:hover {
    background-color: rgba(0,0,0,0.2);
  }
  :focus {
    background-color: black;
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
  &:hover {
    ${SettingsButton} {
      opacity: 1;
    }
  }
  @media (max-width: ${mobileBreakPoint}) {
    margin: 0;
    padding: 8px;
  }
`;

export const PageTitle = styled.div`
`;

export const FooterButton = styled(element(Button))`
`;

export const Container = styled(div)`
  padding: 0 24px 24px 24px;
  width: 540px;
  height: 800px;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 540px) {
    max-width: 100%;
    padding: 0;
  }
`;

export const Body = styled(div)`
  flex: 1;
  display: flex;
  gap: 4px;
  pointer-events: none;
  padding: 4px;
`;

export const Footer = styled(div)`
  display: flex;
  flex-direction: column;
  place-items: end;
  background-image: linear-gradient(to right, #242020, #191919);
  margin: 4px;
  margin-top: 0;
  padding: 16px;
  @media (max-width: 540px) {
    padding: 8px;
  }
`;

export const TagGroup = styled(div)`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 12px;
`;

export const Tag = styled(div) <{ $selected: boolean, $first: boolean, $last: boolean }>`
  font-size: 12px;
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  transition: all 0.2s;
  cursor: pointer;
  background-color: #000;
  color: #FFF;
  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 1;
  }
  ${p => p.$selected && css`
    background-color: #FFF;
    color: #000;
    z-index: 1;
  `}
  ${p => p.$first && css`
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  `}
  ${p => p.$last && css`
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    margin-right: 12px;
  `}
`;

export const AutocompleteOption = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
`;

export const AutocompleteOptionLabel = styled.div`
`;

export const AutocompleteOptionSynonyms = styled.div`
  color: grey;
`;

export const LoaderPlaceholder = styled(Loader)`
  z-index: 9;
  background-image: linear-gradient(to right, #242020, #191919);
`;

export const LeftContent = styled.div`
  flex: 1;
  padding: 16px;
  background-image: linear-gradient(to right, #242020, #191919);
`;

export const RightContent = styled.div`
  flex: 1;
  padding: 16px;
  background-image: linear-gradient(to right, #242020, #191919);
`;

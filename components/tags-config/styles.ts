import styled from 'styled-components';
import { ButtonIcon } from '../button-icon';
import { possible } from '../html';
import { Button } from '../button';
import { mobileBreakPoint } from '@/utils/styles';



export const CloseButton = styled(ButtonIcon)`
`;

export const BodyHeader = styled(possible.div)`
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 40px;
`;

export const SettingsButton = styled(ButtonIcon) <{ selected: boolean, $show: boolean }>`
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

export const BodyGroup = styled(possible.div) <{ $active?: boolean }>`
  flex-direction: column;
  column-gap: 16px;
  row-gap: 8px;
  display: flex;
  background-color: ${p => p.$active ? 'rgba(0,0,0,0.1)' : ''};
  padding: 24px;
  margin: 0 -24px;
  pointer-events: all;
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

export const FooterButton = styled(Button)`
`;

export const ModalContent = styled(possible.div)`
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

export const Body = styled(possible.div)`
  flex: 1;
  display: flex;
  gap: 16px;
  flex-direction: column;
  pointer-events: none;
`;

export const Footer = styled(possible.div)`
  display: flex;
  flex-direction: column;
  place-items: end;
  @media (max-width: 540px) {
    padding: 8px;
  }
`;

export const TagGroup = styled(possible.div)`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 12px;
`;

export const Tag = styled(possible.div) <{ selected: boolean, $first: boolean, $last: boolean }>`
  font-size: 12px;
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  transition: all 0.2s;
  background-color: ${p => p.selected ? '#FFF' : '#000'};
  color: ${p => p.selected ? '#000' : '#FFF'};
  z-index: ${p => p.selected ? 1 : 0};
  cursor: pointer;
  ${p => p.$first ? 'border-top-left-radius: 10px; border-bottom-left-radius: 10px;' : ''}
  ${p => p.$last ? 'border-top-right-radius: 10px; border-bottom-right-radius: 10px;' : ''}
  margin-right: ${p => p.$last ? '12px' : '0'};
  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 1;
  }
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

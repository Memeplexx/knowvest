import { SettingsIcon as BaseSettingsIcon } from '@/utils/styles';
import styled from 'styled-components';
import { possible } from '../html';
import { ButtonIcon } from '../button-icon';

export const Tag = styled(possible.div) <{ selected: boolean, $first: boolean, $last: boolean, $active: boolean }>`
  font-size: 12px;
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  transition: all 0.2s;
  cursor: pointer;
  ${p => p.selected && `
    background-color: #b100b159;
    font-weight: 500;
    z-index: 1;
  `}
  ${p => p.$first && `
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 8px;
  `}
  ${p => p.$last && `
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    margin-right: 12px;
    padding-right: 8px;
  `}
  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 1;
  }
`;

export const ActiveHeaderTag = styled(Tag)`
`;

export const GroupHeaderTag = styled(Tag)`
`;

export const SettingsButton = styled(ButtonIcon)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 4;
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 12px;
`;

export const TagsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

export const Body = styled(possible.div)`
  max-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SettingsIcon = styled(BaseSettingsIcon)`
`;

export const NoTagsPlaceholder = styled(possible.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
`;

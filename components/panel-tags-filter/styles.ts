import styled, { css } from 'styled-components';
import { div } from '../control-conditional';



export const PanelTagsFilterWrapper = styled(div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Tag = styled(div) <{ $selected: boolean, $first: boolean, $last: boolean }>`
  font-size: 12px;
  height: 20px;
  align-items: center;
  padding: 0 4px;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  ${p => p.$selected && css`
    background-color: #b100b1c2;
    z-index: 1;
  `}
  ${p => p.$first && css`
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 8px;
  `}
  ${p => p.$last && css`
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

export const SynonymsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 12px;
`;

export const TagsSection = styled(div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

export const NoTagsPlaceholder = styled(div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  flex: 1;
`;

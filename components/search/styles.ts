import styled from "styled-components";
import { possible } from "../html";
import ReadonlyNote from "../readonly-note";
import { Button } from "../button";
import { dialogWidth, tabsHeight } from "./constants";
import { ButtonIcon } from "../button-icon";

export const Container = styled(possible.div)`
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

export const MainContent = styled(possible.div)`
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

export const TabsWrapper = styled(possible.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: ${tabsHeight};
`;

export const TabTitle = styled(possible.div)`
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

export const LeftContent = styled(possible.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  @media (max-width: ${dialogWidth}px) {
    padding: 16px;
    max-height: 100%;
  }
`;

export const RightContent = styled(possible.div)`
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

export const TagsOuterWrapper = styled(possible.div)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
`;

export const TagsWrapper = styled(possible.div)`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 12px;
`;

export const CategoryTitle = styled(possible.div)`
`;

export const CategoryWrapper = styled(possible.div)`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

export const AutocompleteOption = styled(possible.div)`
  display: flex;
  gap: 16px;
  justify-content: space-between;
`;

export const AutocompleteOptionLeft = styled(possible.div)`
  display: flex;
  gap: 4px;
`;

export const AutocompleteOptionLabel = styled(possible.div)`
`;

export const AutocompleteOptionStatus = styled.div`
  width: 8px;
`;

export const AutocompleteOptionSynonyms = styled(possible.div)`
  color: grey;
`;

export const TagGroup = styled(possible.div)`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2px;
  row-gap: 12px;
`;

export const Tag = styled(possible.button) <{ $hovered: boolean, $first?: boolean, $last?: boolean }>`
  font-size: 12px;
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  transition: all 0.2s;
  background-color: #000;
  color: #FFF;
  cursor: pointer;
  background-color: ${p => p.$hovered ? '#FFF' : '#000'};
  color: ${p => p.$hovered ? '#000' : '#FFF'};
  ${p => p.$first ? 'border-top-left-radius: 10px; border-bottom-left-radius: 10px;' : ''}
  ${p => p.$last ? 'border-top-right-radius: 10px; border-bottom-right-radius: 10px;' : ''}
  margin-right: ${p => p.$last ? '12px' : '0'};
`;

export const Result = styled(ReadonlyNote)`
  cursor: pointer;
  margin: 0 -16px;
  padding: 16px;
  &:hover {
    background-color: rgba(0,0,0,0.4);
  }
`;
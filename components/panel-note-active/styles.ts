import { monoFontFamily } from "@/utils/style-utils";
import styled, { css } from "styled-components";
import { ControlButtonIcon } from "../control-button-icon";
import { div, textarea } from "../control-conditional";


export const PanelNoteActiveWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const TextEditorWrapper = styled(div)`
  flex: 1;
  flex-basis: 0;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 8px;
  position: relative;
`;

export const TextEditor = styled(div) <{ $textIsSelected: boolean }>`
  ${monoFontFamily.style};
  font-size: 12px;
  color: lightgray;
  ${p => p.$textIsSelected && css`margin-bottom: 110px`};
`;

export const ActiveSelectionListItem = styled(div)`
  display: flex;
  gap: 4px;
  font-size: 13px;
  cursor: pointer;
  color: rgba(255,255,255,0.6);
  &:hover {
    color: #FFF;
  }
`;

export const SelectionOptions = styled(div)`
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid transparent;
  transition: all 0.2s;
  font-weight: 400;
  font-size: 12px;
  background-image: linear-gradient(to right,#6f0097,#6b005c);
  user-select: none;
  user-select: none;
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  &:hover {
    background-color: #040404;
    box-shadow: 0px 0px 16px 0px rgba(0,0,0,1);
  }
`;

export const SelectionText = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const FlashCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  border-radius: 4px;
  padding: 8px;
  padding-top: 4px;
  position: relative;
`;

export const DeleteFlashCardButton = styled(ControlButtonIcon)`
  position: absolute;
  top: 8px;
  right: 8px;
  color: grey;
`;

export const CreateFlashCardButton = styled(ControlButtonIcon)`
`;

export const CreateFlashCardInstruction = styled(div)`
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TextArea = styled(textarea)`
  padding: 8px;
  padding-right: 24px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: rgba(0,0,0,0.4);
  &:focus {
    border-color: #949494;
  }
`;

export const FlashCardWrapper = styled(div)`
`;

export const FlashCardActions = styled(div) <{ $if: boolean }>`
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0 8px;
  color: grey;
  visibility: ${p => p.$if ? 'visible' : 'hidden'};
`;

export const FlashCardItemsWrapper = styled(div)`
`;

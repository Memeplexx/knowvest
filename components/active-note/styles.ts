import { monoFontFamily } from "@/utils/style-utils";
import styled from "styled-components";
import { ButtonIcon } from "../button-icon";
import { TextAreaDebounced } from "../debounced";
import { div } from "../html";


export const ActivePanelWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right,#101010,#1d1d1d);
`;

export const TextEditorWrapper = styled(div)`
  flex: 1;
  flex-basis: 0;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TextEditor = styled(div)`
  ${monoFontFamily.style};
  font-size: 12px;
  color: lightgray;
  margin-bottom: 110px;
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
  background-color: rgba(0,0,0,0.4);
  border-radius: 4px;
  margin-top: 4px;
  position: relative;
`;

export const DeleteButton = styled(ButtonIcon)`
  position: absolute;
  top: 0;
  right: 0;
  color: grey;
`;

export const TextArea = styled(TextAreaDebounced)`
  padding: 8px;
  padding-right: 24px;
  border: 1px solid transparent;
  border-radius: 4px;
  &:focus {
    border-color: #949494;
  }
`;

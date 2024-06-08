import { monoFontFamily } from "@/utils/style-utils";
import styled from "styled-components";
import { Card } from "../card";
import { div } from "../html";


export const Wrapper = styled.div`
  position: relative;
  display: flex;
  background-image: linear-gradient(to right,#101010,#1d1d1d);
`;

export const CardWrapper = styled(Card)`
  flex: 1;
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

export const ActiveSelectionListItem = styled.div`
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

import styled from "styled-components";
import { possible } from "../html";



export const TextEditorWrapper = styled(possible.div)`
  flex: 1;
  overflow: auto;
  flex-basis: 0;
  font-weight: ${p => p.theme.fontWeight.textEditor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TextEditor = styled(possible.div)`
  ${p => p.theme.fontFamily.mono.style};
  font-size: ${p => p.theme.fontSize.sm};
  color: lightgray;
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

export const ActiveSelection = styled(possible.div)`
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
  position: relative;
  &:hover {
    background-color: #040404;
    box-shadow: 0px 0px 16px 0px rgba(0,0,0,1);
  }
`;

export const ActiveSelectionInstructions = styled(possible.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  svg {
    width: 18px;
    height: 18px;
    
  }
`;

export const Instruction = styled(possible.div)`
`;

export const ActiveSelectionTagName = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-align: end;
`;

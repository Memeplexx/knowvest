import styled from "styled-components";
import { ActiveSelection } from "../active-selection";
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

export const Buttons = styled(possible.div)`
  grid-column: 2;
  justify-self: end;
  display: flex;
  align-items: center;
  color: grey;
`;

export const SelectionOptions = styled(ActiveSelection)`
`;
import styled from "styled-components";
import { possible } from "../html";
import { AiOutlineLink } from "react-icons/ai";
import ReadonlyNote from "../readonly-note";

export const NoteCount = styled(possible.div)`
  font-size: ${p => p.theme.fontSize.sm};
`;

export const Header = styled(possible.div)`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 4px;
  padding: 0 4px;
  color: #494949;
  font-size: 10px;
  margin: 0 -16px;
`;

export const Icon = styled(AiOutlineLink)`
  color: #494949;
  width: 16px;
  height: 16px;
`;

export const Wrapper = styled(possible.div)`
  font-size: 12px;
  cursor: pointer;
  position: relative;
  margin: 0 -16px;
  padding: 16px;
  :hover {
    background-image: linear-gradient(to right,#212121,#2a2929);
    z-index: 2;
    ${Header}, ${Icon} {
      color: #fff;
    }
  }
`;

export const Result = styled(ReadonlyNote)`
`;


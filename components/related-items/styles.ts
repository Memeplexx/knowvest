import { AiOutlineLink } from "react-icons/ai";
import styled from "styled-components";
import { possible } from "../html";
import ReadonlyNote from "../readonly-note";


export const Header = styled(possible.div)`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 4px;
  padding: 0 4px;
  color: #6f6f6f;
  font-size: 10px;
  margin: 0 -16px;
`;

export const Icon = styled(AiOutlineLink)`
  color: #6f6f6f;
  width: 16px;
  height: 16px;
`;

export const Result = styled(ReadonlyNote)`
`;

export const Wrapper = styled.div`
  font-size: 12px;
  cursor: pointer;
  position: relative;
  margin: 0 -16px;
  padding: 16px;
  background-image: linear-gradient(to right,#21212187,#32303091);
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
  ${Header} {
    transform: scale(1.0);
    transform-origin: bottom right;
    transition: all 0.1s;
  }
  background: black;
  &:hover {
    border-top: 1px solid #2b2b2b;
    border-bottom: 1px solid #000000;
    z-index: 2;
    filter: drop-shadow(4px 4px 8px #000);
    ${Header}, ${Icon} {
      color: #fff;
      font-weight: 400;
    }
    ${Header} {
      transform: scale(1.1) translateY(-10px);
      font-weight: 400;
    }
  }
`;

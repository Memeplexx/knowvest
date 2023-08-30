import { ClockIcon } from "@/utils/styles";
import styled from "styled-components";
import { possible } from "../html";
import ReadonlyNote from "../readonly-note";


export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 4px;
  padding: 0 8px;
  font-size: 10px;
  margin: 0 -16px;
  color: #6f6f6f;
`;

export const Icon = styled(ClockIcon)`
  color: #6f6f6f;
  width: 18px;
  height: 18px;
  margin-right: -4px;
`;

export const Result = styled(ReadonlyNote)`
`;

export const Wrapper = styled.div`
  font-size: 12px;
  cursor: pointer;
  position: relative;
  margin: 0 -16px;
  padding: 16px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
  ${Header} {
    transform: scale(1.0);
    transform-origin: bottom right;
    transition: all 0.1s;
  }
  &:hover {
    border-top: 1px solid #2b2b2b;
    border-bottom: 1px solid #000000;
    z-index: 2;
    ${Header}, ${Icon} {
      color: #fff;
    }
    ${Header} {
      transform: scale(1.1) translateY(-10px);
      font-weight: 400;
    }
  }
`;

export const RightBorder = styled(possible.div)`
  position: absolute;
  right: 12px;
  width: 1px;
  background-color: #6f6f6f;
  top: 40px;
  bottom: -9px;
`;

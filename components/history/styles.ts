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
  color: #494949;
  font-size: 10px;
  margin: 0 -16px;
`;

export const Icon = styled(ClockIcon)`
  color: #494949;
  width: 18px;
  height: 18px;
  margin-right: -4px;
`;

export const Wrapper = styled.div`
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

export const RightBorder = styled(possible.div)`
  position: absolute;
  right: 12px;
  width: 1px;
  background-color: #494949;
  top: 40px;
  bottom: -9px;
`;

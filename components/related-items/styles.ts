import { AiOutlineLink } from "react-icons/ai";
import styled from "styled-components";
import { possible } from "../html";
import ReadonlyNote from "../readonly-note";
import { WiCloudyWindy } from "react-icons/wi";

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

export const ListItem = styled.div`
  font-size: 12px;
  cursor: pointer;
  position: relative;
  margin: 0 -16px;
  padding: 16px;
  transition: all 0.2s;
  transition: all 0.4s;
  background-image: linear-gradient(to right, #242020, #191919);
  border: 1px solid #161616;
  margin-bottom: -1px;
  &:hover {
    background-image: linear-gradient(to right,#252525,#2d2d2d);
    border: 1px solid #3c3c3c;
    z-index: 2;
    ${Header}, ${Icon} {
      color: #fff;
    }
    ${Header} {
      font-weight: 400;
    }
  }
`;

export const NoResultsWrapper = styled(possible.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: grey;
`;

export const ListItemsWrapper = styled.div<{ $showIf: boolean }>`
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  opacity: ${p => p.$showIf ? 1 : 0};
`;

export const NoResultsIcon = styled(WiCloudyWindy)`
  width: 64px;
  height: auto;
`;

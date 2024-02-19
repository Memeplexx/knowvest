import { ClockIcon } from "@/utils/style-utils";
import styled from "styled-components";
import { possible } from "../html";
import ReadonlyNote from "../readonly-note";
import { WiCloudyWindy } from "react-icons/wi";


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

export const RightBorder = styled(possible.div)`
  position: absolute;
  right: 12px;
  width: 1px;
  background-color: #6f6f6f;
  top: 40px;
  bottom: -9px;
  z-index: 4;
`;

export const ListItemsWrapper = styled(possible.div)`
  display: flex;
  flex-direction: column;
`;

export const NoResultsWrapper = styled(possible.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: grey;
`;

export const NoResultsIcon = styled(WiCloudyWindy)`
  width: 64px;
  height: auto;
`;

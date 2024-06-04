import { AiOutlineLink } from "react-icons/ai";
import { WiCloudyWindy } from "react-icons/wi";
import styled from "styled-components";
import { div } from "../html";
import ReadonlyNote from "../readonly-note";

export const Header = styled(div)`
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
  margin-bottom: -1px;
  &:hover {
    background-image: linear-gradient(to right,#252525,#2d2d2d);
    z-index: 2;
    ${Header}, ${Icon} {
      color: #fff;
    }
    ${Header} {
      font-weight: 400;
    }
  }
`;

export const NoResultsWrapper = styled(div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: grey;
`;

export const ListItemsWrapper = styled(div)`
  display: flex;
  flex-direction: column;
`;

export const NoResultsIcon = styled(WiCloudyWindy)`
  width: 64px;
  height: auto;
`;

export const NoteCount = styled(div)`
  font-size: 12px;
`;

import { AiOutlineLink } from "react-icons/ai";
import { WiCloudyWindy } from "react-icons/wi";
import styled from "styled-components";
import { div } from "../control-conditional";
import { PanelNoteReadonly } from "../panel-note-readonly";


export const PanelNotesRelatedWrapper = styled.div`
  display: flex;
`;

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

export const Result = styled(PanelNoteReadonly)`
`;

export const ListItem = styled.div`
  font-size: 12px;
  cursor: pointer;
  position: relative;
  padding: 16px;
  padding-left: 8px;
  transition: all 0.2s;
  transition: all 0.4s;
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
  width: 100%;
`;

export const NoResultsIcon = styled(WiCloudyWindy)`
  width: 64px;
  height: auto;
`;

import { ControlButtonFancy } from "@/components/control-button-fancy";
import { div, element } from "@/components/control-conditional";
import { PanelNoteReadonly } from "@/components/panel-note-readonly";
import { mobileBreakPoint } from "@/utils/style-utils";
import { WiCloudyWindy } from "react-icons/wi";
import styled from "styled-components";


export const PanelFlashCardTesterWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Question = styled(div)`
  flex: 1;
`;

export const Answer = styled(element(PanelNoteReadonly))`
`;

export const Body = styled(div)`
  flex: 1;
  display: flex;
  background-image: linear-gradient(to right, #242020, #191919);
  padding: 60px;
  @media screen and (max-width: ${mobileBreakPoint}) {
    padding: 24px; 
  }
`;

export const Footer = styled(div)`
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(to right, #131313, #212121);
  padding: 16px 60px;
  @media screen and (max-width: ${mobileBreakPoint}) {
    padding: 8px 24px;
  }
`;

export const ToggleViewButton = styled(ControlButtonFancy)`
`;

export const NextButton = styled(element(ControlButtonFancy))`
  gap: 8px;
  border: 1px solid grey;
`;

export const FooterRightContent = styled.div`
  display: flex;
  gap: 16px;
`;

export const NoResults = styled(div)`
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
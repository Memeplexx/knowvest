import { Button } from "@/components/button";
import { div, element } from "@/components/html";
import ReadonlyNote from "@/components/readonly-note";
import { mobileBreakPoint } from "@/utils/style-utils";
import { WiCloudyWindy } from "react-icons/wi";
import styled from "styled-components";


export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4px;
  gap: 4px;
`;

export const Question = styled(div)`
  flex: 1;
`;

export const Answer = styled(element(ReadonlyNote))`
`;

export const Body = styled(div)`
  flex: 1;
  display: flex;
  background-image: linear-gradient(to right, #242020, #191919);
  padding: 60px;
`;

export const Footer = styled(div)`
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(to right, #242020, #191919);
  padding: 16px 60px;
  @media screen and (max-width: ${mobileBreakPoint}) {
    padding: 8px 16px; 
  }
`;

export const ToggleViewButton = styled(Button)`
`;

export const NextButton = styled(element(Button))`
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
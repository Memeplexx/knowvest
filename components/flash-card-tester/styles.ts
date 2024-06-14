import { WiCloudyWindy } from "react-icons/wi";
import styled from "styled-components";
import { Button } from "../button";
import { div, element } from "../html";
import ReadonlyNote from "../readonly-note";

export const Container = styled.div`
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const Question = styled(div)`
  flex: 1;
`;

export const Answer = styled(element(ReadonlyNote))`
`;

export const Body = styled(div)`
  flex: 1;
  display: flex;
`;

export const Footer = styled(div)`
  display: flex;
  justify-content: space-between;
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
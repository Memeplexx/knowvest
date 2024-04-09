import styled from "styled-components";
import { Button } from "../button";
import { possible } from "../html";
import { WiCloudyWindy } from "react-icons/wi";

export const Container = styled.div`
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const Question = styled(possible.div)`
  flex: 1;
`;

export const Body = styled(possible.div)`
  flex: 1;
  display: flex;
`;

export const Footer = styled(possible.div)`
  display: flex;
  justify-content: space-between;
`;

export const ToggleViewButton = styled(Button)`
`;

export const NextButton = styled(possible.element(Button))`
  gap: 8px;
  border: 1px solid grey;
`;

export const FooterRightContent = styled.div`
  display: flex;
  gap: 16px;
`;

export const NoResults = styled(possible.div)`
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
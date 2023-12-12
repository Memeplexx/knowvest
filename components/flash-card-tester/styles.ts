import styled from "styled-components";
import { Button } from "../button";
import { possible } from "../html";

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

export const Body = styled.div`
  flex: 1;
  display: flex;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ToggleViewButton = styled(Button)`
`;

export const NextButton = styled(Button)`
  gap: 8px;
  border: 1px solid grey;
`;

export const FooterRightContent = styled.div`
  display: flex;
  gap: 16px;
`;
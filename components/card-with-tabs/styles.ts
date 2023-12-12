import styled from "styled-components";
import { Card } from "../card";

export const Header = styled.div`
  display: flex;
  gap: 16px;
`;

export const Tab = styled.div`
  flex: 1;
  cursor: pointer;
  align-self: stretch;
  display: flex;
  align-items: center;
`;

export const Underline = styled.div`
  height: 3px;
  background-color: #FFF;
  position: absolute;
  bottom: 3px;
  left: 0;
  transition: 0.2s ease-out;
`;

export const Body = styled.div`
  display: flex;
`;

export const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right, #242020, #191919);
`;

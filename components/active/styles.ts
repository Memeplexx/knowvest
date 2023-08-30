import styled from "styled-components";
import { possible } from "../html";
import { Card } from "../card";


export const Wrapper = styled.div`
  display: flex;
`;

export const CardWrapper = styled(Card)`
  flex: 1;
`;

export const Buttons = styled(possible.div)`
  grid-column: 2;
  justify-self: end;
  display: flex;
  align-items: center;
  color: grey;
`;

import styled from "styled-components";
import { Card } from "../card";
import { Loader } from "../loader";


export const Wrapper = styled.div`
  position: relative;
  display: flex;
  background-image: linear-gradient(to right,#101010,#1d1d1d);
`;

export const CardWrapper = styled(Card)`
  flex: 1;
`;

export const LoaderPlaceholder = styled(Loader)`
  margin-top: 70px;
  background-image: linear-gradient(to right, #242020, #191919);
`;

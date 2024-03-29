import styled from "styled-components";
import { possible } from "../html";
import { Loader } from "../loader";


export const Wrapper = styled(possible.div)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to right, #242020, #191919);
`;

export const Header = styled(possible.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  color: #ffffff;
  transition: box-shadow 0.4s;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 67px;
  z-index: 5;
  font-weight: 400;
  font-size: 19px;
  letter-spacing: 4px;
  background-image: linear-gradient(to right, #242020, #191919);
  padding: 16px;
`;

export const Heading = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
`;

export const Actions = styled.div`
`;

export const Body = styled(possible.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  padding-top: 0;
  overflow-x: hidden;
  > :first-child {
    margin-top: 70px;
    flex: 1;
  }
`;

export const LoaderPlaceholder = styled(Loader)`
  margin-top: 70px;
  background-image: linear-gradient(to right, #242020, #191919);
`;

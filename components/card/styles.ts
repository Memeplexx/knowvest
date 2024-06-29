import { CgMenuGridO } from "react-icons/cg";
import styled from "styled-components";
import { button, div, element } from "../html";


export const CardWrapper = styled(div)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to right, #242020, #191919);
`;

export const HamburgerButton = styled(button)`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

export const HamburgerIcon = styled(element(CgMenuGridO))`
  width: 100%;
  height: 100%;
`;

export const Header = styled(div)`
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

export const Body = styled(div)`
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

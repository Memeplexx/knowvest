import styled from "styled-components";
import { possible } from "../html";
import { mobileBreakPoint } from "@/utils/styles";


export const Wrapper = styled(possible.div)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to right,#030303,#191818);
  @media (min-width: ${mobileBreakPoint}) {
    animation: 1s ease-out 0s 1 scale-up;
    background-image: linear-gradient(to right,#030303a6,#191818d9);
    @keyframes scale-up {
      0% {
        opacity: 0;
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
`;

export const Header = styled(possible.div)`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #717171;
  transition: box-shadow 0.4s;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 70px;
  z-index: 1;
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
  }
`;

import styled from "styled-components";
import { possible } from "../html";
import { mobileBreakPoint } from "@/utils/style-utils";


export const Wrapper = styled(possible.button)<{ selected?: boolean }>`
  cursor: pointer;
  width: 30px;
  height: 30px;
  padding: 6px;
  display: flex;
  background-color: transparent;
  border-radius: 50%;
  svg {
    width: auto;
    height: auto;
  }
  ${p => p.selected && `
    background-color: #000;
  `}
  ${p => p.selected && `
    opacity: 0.5;
  `}
  @media (min-width: ${mobileBreakPoint}) {
    transform: scale(1);
    transition: all 0.2s cubic-bezier(0,.73,.44,1);
    &:hover {
      transform: scale(1.4);
      background-color: ${p => p.selected ? '#000' : 'rgba(255,255,255,0.1)'};
      filter: drop-shadow(0 0mm 4mm rgba(0,0,0,0.4));
    }
    &:active {
      transform: scale(0.8);
    }
  }
`;
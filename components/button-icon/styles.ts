import styled from "styled-components";
import { possible } from "../html";
import { mobileBreakPoint } from "@/utils/styles";


export const Wrapper = styled(possible.button)<{ selected?: boolean }>`
  cursor: pointer;
  width: 40px;
  height: 40px;
  padding: 6px;
  opacity: ${p => p.disabled ? 0.5 : 1};
  pointer-events: ${p => p.disabled ? 'none' : 'auto'};
  background-color: ${p => p.selected ? '#000' : 'transparent'};
  display: flex;
  svg {
    width: auto;
    height: auto;
  }
  @media (min-width: ${mobileBreakPoint}) {
    transform: scale(0.65);
    transition: all 0.2s cubic-bezier(0,.73,.44,1);
    &:hover {
      transform: scale(1);
      background-color: ${p => p.selected ? '#000' : '#313131'};
      filter: drop-shadow(0 0mm 4mm rgba(0,0,0,0.4));
    }
    &:active {
      transform: scale(0.8);
    }
  }
`;
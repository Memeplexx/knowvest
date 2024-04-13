import styled, { css } from "styled-components";
import { mobileBreakPoint } from "@/utils/style-utils";
import { button } from "../html";


export const Wrapper = styled(button)<{ selected?: boolean, $highlighted?: boolean }>`
  cursor: pointer;
  padding: 8px 16px;
  background-color: transparent;
  display: flex;
  align-items: center;
  color: #ffb1fc;
  ${p => p.selected && css`
    background-color: #000;
  `}
  ${p => p.disabled && css`
    opacity: 0.5;
    pointer-events: none;
  `}
  @media (min-width: ${mobileBreakPoint}) {
    transform: scale(1);
    transition: all 0.2s cubic-bezier(0,.73,.44,1);
    &:hover {
      transform: scale(1.2);
      background-color: ${p => p.selected ? '#000' : '#313131'};
      filter: drop-shadow(0 0mm 4mm rgba(0,0,0,0.4));
    }
    &:active {
      transform: scale(1);
    }
  }
  ${p => p.$highlighted && css`
    --border-size: 1px;
    --border-angle: 0turn;
    background-image: conic-gradient(from var(--border-angle), #213, #112 50%, #213), conic-gradient(from var(--border-angle), transparent 20%, #08f, #f03);
    background-size: calc(100% - (var(--border-size) * 2)) calc(100% - (var(--border-size) * 2)), cover;
    background-position: center center;
    background-repeat: no-repeat;
    animation: bg-spin 3s linear infinite;
    @keyframes bg-spin {
      to {
        --border-angle: 1turn;
      }
    }
    @property --border-angle {
      syntax: "<angle>";
      inherits: true;
      initial-value: 0turn;
    }
  `}
`;
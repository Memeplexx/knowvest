import styled from "styled-components";
import { possible } from "../html";
import { mobileBreakPoint } from "@/utils/styles";


export const Wrapper = styled(possible.button)<{ selected?: boolean }>`
  cursor: pointer;
  background: #121212;
  padding: 8px 16px;
  opacity: ${p => p.disabled ? 0.5 : 1};
  pointer-events: ${p => p.disabled ? 'none' : 'auto'};
  background-color: ${p => p.selected ? '#000' : 'transparent'};
  display: flex;
  align-items: center;
  color: #ffb1fc;
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

`;
"use client";
import { defaultFontFamily, mobileBreakPoint } from "@/utils/styles";
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(images/backdrop-red.svg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 4px;
  ${defaultFontFamily.style};
`;

export const Title = styled.h1`
  font-size: 18px;
`;

export const SubTitle = styled.h2`
  font-size: 16px;
  color: black;
`;

export const CenterContent = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #FFF;
  align-self: normal;
`;

export const ProviderButton = styled.button`
  background-color: rgba(0,0,0,0.1);
  padding: 8px 16px;
  cursor: pointer;
  transform: scale(1);
  transition: all 0.4s;
  @media (min-width: ${mobileBreakPoint}) {
    transform: scale(1);
    transition: all 0.2s cubic-bezier(0,.73,.44,1);
    &:hover {
      transform: scale(1.2);
      background-color: rgba(0,0,0,0.2);
      filter: drop-shadow(0 0mm 4mm rgba(0,0,0,0.4));
    }
    &:active {
      transform: scale(1);
    }
  }
`;
"use client";
import { Montserrat } from "next/font/google";
import styled from "styled-components";
import { globalStylesWrapperId } from "./app-utils";



export const defaultFontFamily = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const GlobalStylesProvider = ({ children }: { children?: React.ReactNode }) => (
  <GlobalStylesWrapper
    id={globalStylesWrapperId}
    children={children}
  />
);

const GlobalStylesWrapper = styled.div`
  ${defaultFontFamily.style};
`;

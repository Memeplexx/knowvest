'use client';
import { button, div } from '@/components/control-conditional';
import { Source_Code_Pro } from 'next/font/google';
import { useServerInsertedHTML } from 'next/navigation';
import React, { useState } from 'react';
import styled, { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}

export const monoFontFamily = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
})

export const PopupOptions = styled(div)`
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0px 0px 38px #000);
  background-image: linear-gradient(to right,#212121,#312c2c);
  color: #FFF;
  max-width: 400px;
  z-index: 5;
  letter-spacing: 0;
`;

export const PopupOption = styled(button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-transform: none;
  font-size: 12px;
  font-weight: 300;
  padding-right: 8px;
  transition: transform 0.4s cubic-bezier(0,.73,.44,1);
  transform: scale(1);
  padding: 8px;
  &:hover {
    transform: scale(1.05);
    background-color: #323232;
    cursor: pointer;
    filter: drop-shadow(0px 0px 38px #000);
  }
  svg {
    width: 16px;
    height: auto;
  }
`;

export const mobileBreakPoint = '1000px';

export const panelGap = '4px';

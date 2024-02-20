'use client';
import { possible } from "@/components/html";
import { Montserrat, Source_Code_Pro } from 'next/font/google';
import { AiFillTag } from "react-icons/ai";
import { CiBeaker1, CiCirclePlus, CiClock2, CiFilter, CiGrid2V, CiMaximize1, CiSearch, CiSettings, CiTrash } from "react-icons/ci";
import { MdClear, MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md";
import styled, { css } from "styled-components";
import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
 
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

export const defaultFontFamily = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const monoFontFamily = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
})

export const PopupOptions = styled(possible.div)`
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0px 0px 38px #000);
  background-image: linear-gradient(to right,#212121,#312c2c);
  color: #FFF;
  max-width: 400px;
  z-index: 5;
  letter-spacing: 0;
`;

export const PopupOption = styled(possible.button)`
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

const resetIconDims = css`
  width: 100%;
  height: 100%;
`;

export const OptionText = styled.div``;

export const CreateIcon = styled(CiCirclePlus)``;

export const DuplicateIcon = styled(CiGrid2V)``;

export const DeleteIcon = styled(CiTrash)``;

export const SettingsIcon = styled(CiSettings)``;

export const TagIcon = styled(AiFillTag)``;

export const ClockIcon = styled(CiClock2)``;

export const AddIcon = styled(CiCirclePlus)``;

export const SplitIcon = styled(CiMaximize1)``;

export const FilterIcon = styled(CiFilter)``;

export const CloseIcon = styled(MdClear)``;

export const SearchIcon = styled(CiSearch)``;

export const TestIcon = styled(CiBeaker1)``;

export const LeftIcon = styled(MdKeyboardArrowLeft)`
${resetIconDims}
`;

export const RightIcon = styled(MdKeyboardArrowRight)`
  ${resetIconDims}
`;

export const UpIcon = styled(MdKeyboardArrowUp)`
  ${resetIconDims}
`;

export const DownIcon = styled(MdKeyboardArrowDown)`
  ${resetIconDims}
`;

export const mobileBreakPoint = '1000px';


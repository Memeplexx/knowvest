import { SearchIcon as BaseSearchIcon, mobileBreakPoint } from "@/utils/style-utils";
import Image from "next/image";
import Link from "next/link";
import { CgMenuGridO } from "react-icons/cg";
import { PiStudentFill } from 'react-icons/pi';
import styled, { css } from "styled-components";
import { ControlButtonIcon } from "../control-button-icon";
import { button, div, element } from "../control-conditional";

export const PanelNavbarWrapper = styled.div`
  z-index: 11;
  display: flex;
  align-items: center;
  padding: 8px 24px;
  transition: 0.2s all;
  justify-content: space-between;
  gap: 12px;
  background-image: linear-gradient(to right, #131313, #212121);
  position: relative;
  margin-top: 0;
  height: 64px;
  @media screen and (max-width: ${mobileBreakPoint}) {
    border-bottom: 0.2px solid #5a5a5a; 
    padding: 0 8px;
  }
`;

export const HomeLink = styled(element(Link))`
`;

export const ImageLogo = styled(Image)`
`;

export const LeftContent = styled(div)`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const PageTitle = styled.div`
  font-size: 24px;
`;

export const RightContent = styled(div)`
  display: flex;
  gap: 8px;
  align-items: center;
  gap: 16px;
`;

export const SearchIcon = styled(BaseSearchIcon)`
`;

export const UserButton = styled.button`
  transform: scale(1);
  transition: all 0.2s cubic-bezier(0,.73,.44,1);
  &:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0mm 4mm rgba(0,0,0,0.4));
  }
  &:active {
    transform: scale(1);
  }
`;

export const UserImage = styled(Image)`
  border-radius: 50%;
  cursor: pointer;
`;

export const SearchButton = styled(ControlButtonIcon) <{ $active: boolean }>`
  background-color: rgba(255,255,255,0.2);
  ${p => p.$active && css`
    border: 1px solid #FFF;
  `}
`;

export const FlashCardButton = styled(ControlButtonIcon) <{ $active: boolean }>`
  position: relative;
  background-color: rgba(255,255,255,0.2);
  ${p => p.$active && css`
    border: 1px solid #FFF;
  `}
`;

export const FlashCardIcon = styled(PiStudentFill)`
`;

export const FlashCardCount = styled.div`
  position: absolute;
  right: -5px;
  bottom: -5px;
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


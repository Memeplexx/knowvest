import { SearchIcon as BaseSearchIcon } from "@/utils/style-utils";
import Image from "next/image";
import { PiStudentFill } from 'react-icons/pi';
import styled, { css } from "styled-components";
import { ButtonIcon } from "../button-icon";
import { div } from "../html";

export const NavBarWrapper = styled.div<{ $show?: boolean }>`
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 8px 24px;
  transition: 0.2s all;
  justify-content: space-between;
  gap: 12px;
  background-image: linear-gradient(to right, #131313, #212121);
  margin-top: -64px;
  position: relative;
  ${p => p.$show && css`
    margin-top: 0;
  `}
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

export const SearchButton = styled(ButtonIcon) <{ $active: boolean }>`
  background-color: rgba(255,255,255,0.2);
  ${p => p.$active && css`
    border: 1px solid #FFF;
  `}
`;

export const FlashCardButton = styled(ButtonIcon) <{ $active: boolean }>`
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

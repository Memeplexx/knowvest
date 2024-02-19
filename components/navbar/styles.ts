import Image from "next/image";
import styled from "styled-components";
import { possible } from "../html";
import { SearchIcon as BaseSearchIcon } from "@/utils/style-utils";
import { ButtonIcon } from "../button-icon";
import { PiStudentFill } from 'react-icons/pi';

export const Wrapper = styled.div<{ $show?: boolean }>`
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 8px;
  transition: 0.2s all;
  justify-content: space-between;
  gap: 12px;
  background-image: linear-gradient(to right, #131313, #212121);
  margin-top: -60px;
  ${p => p.$show && `
    margin-top: 0;
  `}
`;

export const ImageLogo = styled(Image)`
`;

export const RightContent = styled(possible.div)`
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

export const SearchButton = styled(ButtonIcon)`
  background-color: rgba(255,255,255,0.2);
`;

export const FlashCardButton = styled(ButtonIcon)`
  position: relative;
  background-color: rgba(255,255,255,0.2);
`;

export const FlashCardIcon = styled(PiStudentFill)`
`;

export const FlashCardCount = styled.div`
  position: absolute;
  right: -5px;
  bottom: -5px;
`;
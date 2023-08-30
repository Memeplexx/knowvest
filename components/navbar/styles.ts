import Image from "next/image";
import styled from "styled-components";
import { possible } from "../html";
import { SearchIcon as BaseSearchIcon } from "@/utils/styles";
import { ButtonIcon } from "../button-icon";

export const Wrapper = styled.div<{ $show?: boolean }>`
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 8px;
  padding-bottom: 0;
  transition: 0.2s all;
  margin-top: ${p => p.$show ? '0' : '-52px'};
  justify-content: space-between;
  gap: 12px;
  height: 52px;
`;

export const ImageLogo = styled(Image)`
`;

export const RightContent = styled(possible.div)`
  display: flex;
  gap: 8px;
`;

export const SearchIcon = styled(BaseSearchIcon)`
`;

export const UserButton = styled(Image)`
  border-radius: 50%;
  cursor: pointer;
`;

export const SearchButton = styled(ButtonIcon)`
`;
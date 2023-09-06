import { possible } from "@/components/html";
import { Montserrat, Source_Code_Pro } from 'next/font/google';
import { AiFillTag } from "react-icons/ai";
import { CiCirclePlus, CiClock2, CiFilter, CiGrid2V, CiMaximize1, CiSearch, CiSettings, CiTrash } from "react-icons/ci";
import { MdClear, MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md";
import styled, { css } from "styled-components";

export const defaultFontFamily = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const monoFontFamily = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
})

export const styles = {
  color: {
    accent: '#96ff37',
    // accent: 'magenta',
    primary: '#FFF',
  },
  fontSize: {
    sm: css`
      font-size: 12px
    `
  },
  backgroundColor: {
    darkGrey: css`
      background-color: #18181B;
    `,
    grey: css`
      background-color: #323232;
    `
  },
  animation: {
    bounceOnClick: css`
      transition: 0.2s all;
      &:active {
        transform: scale(0.8);
      }
    `,
    expandOnHover: css`
      transition: 0.2s all;
      &:hover {
        transform: scale(1.3);
      }
    `
  },
} as const;


export const PopupOptions = styled(possible.div)`
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0px 0px 38px #000);
  background-image: linear-gradient(to right,#212121,#312c2c);
  color: #FFF;
  border: 0.5px solid #4b4b4b;
  max-width: 400px;
  z-index: 5;
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
    border: 1px solid #4b4b4b;
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

export const IconButton = styled(possible.button)`
  display: flex;
  cursor: pointer;
  svg {
    flex: 1;
  }
`;

export const mobileBreakPoint = '1000px';


import { Active } from "@/components/active";
import { History } from "@/components/history";
import { Related } from "@/components/related";
import { Tags } from "@/components/tags";
import { IconButton, defaultFontFamily, mobileBreakPoint } from "@/utils/styles";
import styled from "styled-components";

const gap = '4px';



const BaseToggleButton = styled(IconButton) <{ selected?: boolean }>`
  width: 32px;
  height: 32px;
  position: fixed;
  z-index: 3;
  background-color: ${p => p.selected ? '#FFF' : '#000'};
  color: ${p => p.selected ? '#000' : '#FFF'};
  transition: 0.4s transform;
  border-radius: 50%;
  border: 1px solid #4d4d4d;
  &:not(:hover) {
    opacity: 0.3;
  }
  @media (min-width: ${mobileBreakPoint}) {
    display: none!important;
  }
`;

export const ExpandHistoryToggleButton = styled(BaseToggleButton)`
  top: 50%;
  left: ${gap};
  transform: translateY(-50%) rotate(${p => !p.selected ? '0' : '180deg'});;
`;

export const ExpandTagsToggleButton = styled(BaseToggleButton)`
  left: 50%;
  bottom: ${gap};
  transform: translateX(-50%) rotate(${p => !p.selected ? '0' : '180deg'});;
`;

export const ExpandRelatedToggleButton = styled(BaseToggleButton)`
  top: 50%;
  right: ${gap};
  transform: translateY(-50%) rotate(${p => !p.selected ? '0' : '180deg'});;
`;

export const ExpandHeaderToggleButton = styled(BaseToggleButton)`
  left: 50%;
  top: ${gap};
  transform: translateX(-50%) rotate(${p => !p.selected ? '0' : '180deg'});;
`;


export const ActivePanel = styled(Active)`
  flex: 1;
  min-height: 50vh;
`;

export const TagsPanel = styled(Tags) <{ $expanded: boolean }>`
  transition: transform 0.2s ease-out;
  @media (max-width: ${mobileBreakPoint}) {
    z-index: 2;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    transform: translateY(${p => p.$expanded ? '0' : `calc(100% + ${gap})`});
    z-index: ${p => p.$expanded ? 4 : 0};
  }
`;

export const HistoryPanel = styled(History) <{ $expanded: boolean }>`
  @media (max-width: ${mobileBreakPoint}) {
    transition: transform 0.2s ease-out;
    z-index: 2;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    transform: translateX(${p => p.$expanded ? '0' : `calc(-100% - ${gap})`});
  }
`;

export const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  z-index: 1;
  position: relative;
  @media (min-width: ${mobileBreakPoint}) {
    row-gap: ${gap};
  }
`;

export const RelatedPanel = styled(Related) <{ $expanded: boolean }>`
  @media (max-width: ${mobileBreakPoint}) {
    transition: transform 0.2s ease-out;
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    transform: translateX(${p => p.$expanded ? '0' : `calc(100% + ${gap})`});
  }
`;

export const Wrapper = styled.div`
  min-height: 0;
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  ${defaultFontFamily.style};
  /* color: white; */
  background-color: black;
`;

export const BodyWrapper = styled.div`
  min-height: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: ${gap};
  flex: 1;
  height: auto;
  position: relative;
  @media (min-width: ${mobileBreakPoint}) {
    margin: ${gap};
  }
`;

"use client";
import { ActivePanel } from "@/components/active-panel";
import { ButtonIcon } from "@/components/button-icon";
import { Tabs } from "@/components/card-with-tabs";
import { History } from "@/components/history";
import { Loader } from "@/components/loader";
import { Related } from "@/components/related";
import { defaultFontFamily, mobileBreakPoint } from "@/utils/style-utils";
import styled from "styled-components";

const gap = '4px';



const BaseToggleButton = styled(ButtonIcon) <{ selected?: boolean }>`
  width: 32px;
  height: 32px;
  position: fixed;
  z-index: 8;
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

export const ActivePane = styled(ActivePanel)`
  flex: 1;
`;

export const TabsPanel = styled(Tabs) <{ $expanded: boolean }>`
  transition: transform 0.2s ease-out;
  flex: 1;
  @media (max-width: ${mobileBreakPoint}) {
    z-index: 2;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    transform: translateY(${p => p.$expanded ? '0' : `calc(100% + ${gap})`});
    z-index: ${p => p.$expanded ? 5 : 0};
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
  > * {
    flex: 1;
  }
`;

export const LoaderPlaceholder = styled(Loader)`
  z-index: 9;
  background-image: linear-gradient(to right, #242020, #191919);
`;

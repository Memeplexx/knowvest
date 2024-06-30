"use client"
import { div } from "@/components/html";
import { OverlayLoader } from "@/components/overlay-loader";
import { defaultFontFamily } from "@/utils/style-utils";
import styled from "styled-components";

export const Wrapper = styled(div)`
  min-height: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  ${defaultFontFamily.style};
  background-color: black;
`;

export const LoaderPlaceholder = styled(OverlayLoader)`
  flex: 1;
  z-index: 9;
  background-image: linear-gradient(to right, #242020, #191919);
`;
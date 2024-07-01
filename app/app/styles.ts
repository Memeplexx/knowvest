"use client"
import { div } from "@/components/control-conditional";
import { OverlayLoader } from "@/components/overlay-loader";
import styled from "styled-components";

export const Wrapper = styled(div)`
  min-height: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: black;
`;

export const LoaderPlaceholder = styled(OverlayLoader)`
  flex: 1;
  z-index: 9;
  background-image: linear-gradient(to right, #242020, #191919);
`;
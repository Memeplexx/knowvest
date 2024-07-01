"use client";
import { IfProps, div } from "@/components/control-conditional";
import { Montserrat } from "next/font/google";
import { HTMLProps, ReactNode } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import { useEventHandlerForDocument } from "./dom-utils";
import { useHtmlPropsOnly } from "./react-utils";



const id = 'global-styles-wrapper';

export const defaultFontFamily = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const GlobalStylesProvider = ({ children }: { children?: React.ReactNode }) => (
  <GlobalStylesWrapper
    id={id}
    children={children}
  />
);

const GlobalStylesWrapper = styled.div`
  ${defaultFontFamily.style};
`;

export const globalStylesContainer = () => document.getElementById(id)!;

type OverlayProps
  = {
    overlay: ReactNode,
    onClickBackdrop?: () => void,
    onEscapeKeyPressed?: () => void,
    blurBackdrop: boolean,
  }
  & IfProps
  & HTMLProps<HTMLDivElement>;

export const Overlay = (props: OverlayProps) => {

  useEventHandlerForDocument('keyup', event => {
    if (!props.onEscapeKeyPressed)
      return;
    if (event.key !== 'Escape')
      return;
    props.onEscapeKeyPressed();
  })

  const htmlProps = useHtmlPropsOnly(props);

  return props.if ? createPortal((
    <PopupBackDrop
      {...htmlProps}
      $blurBackdrop={props.blurBackdrop}
      onClick={() => props.onClickBackdrop?.()}
      children={props.overlay}
    />
  ), document.getElementById(id)!) : <></>;
}

export const PopupBackDrop = styled(div) <{ $blurBackdrop: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0,0,0,0.2);
  ${p => p.$blurBackdrop && css`backdrop-filter: blur(2px)`}
`;

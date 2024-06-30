"use client";
import { Props } from "./constants";
import { OverlayLoaderWrapper, Spinner } from "./styles";

export const OverlayLoader = (props: Props) => {
  return (
    <OverlayLoaderWrapper
      className={props.className}
      $if={props.if}
      children={<Spinner />}
    />
  );
}
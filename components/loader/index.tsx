"use client";
import { Props } from "./constants";
import { Container, Spinner } from "./styles";

export const Loader = (props: Props) => {
  return (
    <Container
      className={props.className}
      $if={props.if}
      children={<Spinner />}
    />
  );
}
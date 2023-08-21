import { ButtonHTMLAttributes } from "react";

export type Props = {
  selected?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>;

import { ButtonHTMLAttributes } from "react";

export type Props = {
  selected?: boolean;
  highlighted: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

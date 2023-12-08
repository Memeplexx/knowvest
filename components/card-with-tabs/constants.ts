import { HTMLAttributes } from "react";
import { ComponentType } from "react-spring";

export type Props = {
  options: {
    label: string;
    panel: ComponentType<unknown>;
  }[];
} & HTMLAttributes<HTMLDivElement>
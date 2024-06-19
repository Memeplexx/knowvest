import { usePropsWithDefaults } from "@/utils/react-utils";
import { useDrag } from "@use-gesture/react";
import { PropsWithChildren, useRef } from "react";
import { useSpring } from "react-spring";
import { Props, defaultProps } from "./constants";

export const useInputs = (propsIncoming: PropsWithChildren<Props>) => {

  const menuRef = useRef<HTMLDivElement>(null);

  const props = usePropsWithDefaults({ ...propsIncoming }, defaultProps);

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    switch (props.position) {
      case 'left': {
        if (mx === 0)
          return;
        if (mx < 0)
          props.onShow(false);
        if (mx >= props.size)
          props.onShow(true);
        if (!down)
          api.start({ x: mx < props.size ? 0 : Math.min(props.size, mx) });
        else
          api.start({ x: Math.min(props.size, mx) });
        break;
      }
      case 'right': {
        if (mx === 0)
          return;
        if (mx > 0)
          props.onShow(false);
        if (mx <= -props.size)
          props.onShow(true);
        if (!down)
          api.start({ x: mx > -props.size ? 0 : Math.max(-props.size, mx) });
        else
          api.start({ x: Math.max(-props.size, mx) });
        break;
      }
      case 'top': {
        if (my === 0)
          return;
        if (my < 0)
          props.onShow(false);
        if (my >= props.size)
          props.onShow(true);
        if (!down)
          api.start({ y: my < props.size ? 0 : Math.min(props.size, my) });
        else
          api.start({ y: Math.min(props.size, my) });
        break;
      }
      case 'bottom': {
        if (my === 0)
          return;
        if (my > 0)
          props.onShow(false);
        if (my <= -props.size)
          props.onShow(true);
        if (!down)
          api.start({ y: my > -props.size ? 0 : Math.max(-props.size, my) });
        else
          api.start({ y: Math.max(-props.size, my) });
        break;
      }
    }
  });

  return {
    bind,
    x,
    y,
    menuRef,
    props,
    api,
  }
}
"use client";

import { useLocalStore } from "@/utils/store-utils";
import { useFloating } from "@floating-ui/react";
import { ForwardedRef, useImperativeHandle } from "react";
import { PopupHandle, Props } from "./constants";


export const useInputs = (
  props: Props,
  forwardedRef: ForwardedRef<PopupHandle>
) => {
  const { local, state } = useLocalStore(props.storeKey, { show: false });

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  useImperativeHandle(forwardedRef, () => ({
    hide: function hide() { local.show.$set(false); }
  }), [local]);

  return {
    floatingRef,
    local,
    ...state,
  }
}

"use client";

import { useState } from 'react';
import { Wrapper } from './styles';

export const LoaderSkeleton = (props: { isVisible?: boolean, className?: string } = { isVisible: true }) => {
  const [show, setShow] = useState(props.isVisible);
  if (show && !props.isVisible) {
    setTimeout(() => setShow(false), 500);
  }
  return (
    <Wrapper
      className={props.className}
      $show={show}
    />
  )
}

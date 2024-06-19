import { useComponent, usePropsWithDefaults } from '@/utils/react-utils';
import { useDrag } from '@use-gesture/react';
import { HTMLAttributes, PropsWithChildren, ReactNode, useMemo, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';


type Props = {
  menuContent: ReactNode,
  mainContent: ReactNode,
  edgeThreshold?: number,
  show: boolean,
  onShow: (show: boolean) => void,
  position: 'left' | 'right' | 'top' | 'bottom',
} & HTMLAttributes<HTMLElement>;

const defaultProps: Partial<Props> = {
  edgeThreshold: 25,
  position: 'left',
};

export const LeftNav = (propsIncoming: PropsWithChildren<Props>) => {

  const menuRef = useRef<HTMLDivElement>(null);

  const props = usePropsWithDefaults({ ...propsIncoming }, defaultProps);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const component = useComponent();

  const width = useMemo(() => {
    if (!component.isMounted) return 0;
    return menuRef.current!.offsetWidth;
  }, [component.isMounted]);

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx] }) => {
    if (mx === 0)
      return;
    if (mx < 0)
      props.onShow(false);
    if (mx >= width)
      props.onShow(true);
    if (!down)
      api.start({ x: mx < width ? 0 : Math.min(width, mx) });
    else
      api.start({ x: Math.min(width, mx) });
  });

  const onClickMainOverlay = () => {
    api.start({ x: 0 });
    props.onShow(false);
  }

  return (
    <>
      <LeftNavWrapper
        {...bind()}
        style={{ x }}
        $width={width}
        $edgeThreshold={props.edgeThreshold!}
        children={
          <Content
            children={
              <MenuContent
                ref={menuRef}
                children={props.menuContent}
              />
            }
          />
        }
      />
      {props.mainContent}
      <MainContentOverlay
        onClick={onClickMainOverlay}
        $show={props.show}
      />
    </>
  )
};

const LeftNavWrapper = styled(animated.div) <{ $width: number, $edgeThreshold: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -${p => p.$width}px;
  width: ${p => p.$width + p.$edgeThreshold}px;
  background-color: transparent;
  z-index: 10;
  touch-action: none;
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
`;

export const MenuContent = styled.div`
  background-color: #fff;
`;

export const MainContentOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  opacity: ${({ $show }) => $show ? '1' : '0'};
  pointer-events: ${({ $show }) => $show ? 'auto' : 'none'};
`;

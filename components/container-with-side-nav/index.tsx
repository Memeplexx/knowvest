import { PropsWithChildren } from 'react';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ContainerWithSideNavWrapper, MenuContent, MenuWrapper, SideNavOverlay } from './styles';


export const ContainerWithSideNav = (props: PropsWithChildren<Props>) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(props, inputs);
  return (
    <ContainerWithSideNavWrapper
      children={
        <>
          <MenuWrapper
            {...inputs.bind()}
            style={{ x: inputs.x, y: inputs.y }}
            $size={props.size}
            $edgeThreshold={props.edgeThreshold}
            $position={props.position}
            children={
              <MenuContent
                ref={inputs.menuRef}
                children={props.menuContent}
              />
            }
          />
          {props.mainContent}
          <SideNavOverlay
            onClick={outputs.onClickMainOverlay}
            $show={props.show}
          />
        </>
      }
    />
  )
};



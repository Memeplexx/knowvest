import { PropsWithChildren } from 'react';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { MenuContent, SideNavOverlay, SideNavWrapper } from './styles';


export const SideNav = (propsIncoming: PropsWithChildren<Props>) => {
  const inputs = useInputs(propsIncoming);
  const outputs = useOutputs(inputs);
  return (
    <>
      <SideNavWrapper
        {...inputs.bind()}
        style={{ x: inputs.x, y: inputs.y }}
        $size={inputs.props.size}
        $edgeThreshold={inputs.props.edgeThreshold}
        $position={inputs.props.position}
        children={
          <MenuContent
            ref={inputs.menuRef}
            children={
              <>
                <div style={{ color: 'white', textAlign: 'end' }}>{inputs.n}</div>
                {inputs.props.menuContent}
              </>
            }
          // style={{ border: `2px solid ${inputs.props.show ? 'white' : 'transparent'}` }}
          />
        }
      />
      {inputs.props.mainContent}
      <SideNavOverlay
        onClick={outputs.onClickMainOverlay}
        $show={inputs.props.show}
      />
    </>
  )
};



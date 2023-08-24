import { Container, Message, Popup } from './styles';
import { Props, snackbarStatuses } from './constants';
import { useInputs } from './inputs';


export const Snackbar = function Snackbar(
  partialProps: Props,
) {
  const inputs = useInputs(partialProps);
  const { state, refs, props } = inputs;
  return (
    <Container
      ref={refs.floating.refs.setReference}
      children={
        <Popup
          ref={refs.floating.refs.setFloating}
          style={refs.floating.floatingStyles}
          children={
            state.messages.map(m => (
              <Message
                key={m.ts}
                count={state.count}
                showIf={m.show}
                index={m.index}
                animation={props.animationDuration}
                gap={props.stackGap}
                status={props.status}
                children={
                  <>
                    {snackbarStatuses[props.status].icon()}
                    {props.renderMessage ? props.renderMessage(m.text) : m.text}
                  </>
                }
              />
            ))
          }
        />
      }
    />
  );
};


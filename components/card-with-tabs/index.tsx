"use client";
import { Props } from "./constants";
import { useInputs } from "./inputs";
import { Body, Container, Header, Tab, Underline } from "./styles";

export const Tabs = (
  props: Props,
) => {
  const { options, ...remainingProps } = props;
  const inputs = useInputs(props);
  const { Panel } = inputs;
  return (
    <Container
      {...remainingProps}
      heading={
        <Header
          children={
            <>
              {options.map(option => (
                <Tab
                  key={option.label}
                  children={option.label}
                  ref={inputs.tabsRef[option.label]}
                  onClick={() => inputs.setState({ selected: option.label })}
                />
              ))}
              <Underline
                style={inputs.underline}
              />
            </>
          }
        />
      }
      body={
        <Body
          children={
            <Panel />
          }
        />
      }
    />
  )
}
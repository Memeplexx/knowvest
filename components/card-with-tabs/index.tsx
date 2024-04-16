"use client";
import { Props } from "./constants";
import { useInputs } from "./inputs";
import { Body, Container, Header, Tab, Underline } from "./styles";

export const Tabs = (
  props: Props,
) => {
  const { options, ...remainingProps } = props;
  const inputs = useInputs(props);
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
                  onClick={() => inputs.set({ selected: option.label })}
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
            <inputs.Panel />
          }
        />
      }
    />
  )
}
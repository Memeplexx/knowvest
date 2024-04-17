"use client";
import { Props } from "./constants";
import { useInputs } from "./inputs";
import { Body, Container, Header, Tab, Underline } from "./styles";

export const Tabs = (
  props: Props,
) => {
  const inputs = useInputs(props);
  return (
    <Container
      {...inputs.htmlProps}
      heading={
        <Header
          children={
            <>
              {props.options.map(option => (
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
"use client";
import { useUnknownPropsStripper } from "@/utils/react-utils";
import { Props } from "./constants";
import { useInputs } from "./inputs";
import { Body, Container, Header, Tab, Underline } from "./styles";

export const Tabs = (
  props: Props,
) => {
  const inputs = useInputs(props);
  return (
    <Container
      {...useUnknownPropsStripper(props)}
      heading={
        <Header
          children={
            <>
              {props.options.map(({ label }) => (
                <Tab
                  key={label}
                  children={label}
                  ref={inputs.tabsRef[label]}
                  onClick={() => props.onSelectTab(label)}
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
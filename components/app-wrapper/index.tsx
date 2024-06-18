"use client"
import { Navbar } from "../navbar";
import { useInputs } from "./inputs";
import { LoaderPlaceholder, Wrapper } from "./styles";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const inputs = useInputs();
  return (
    <>
      <LoaderPlaceholder
        if={!inputs.isReady || inputs.showLoader}
      />
      <Wrapper
        if={inputs.isReady}
        children={
          <>
            <Navbar
              if={inputs.headerExpanded}
            />
            {children}
          </>
        }
      />
    </>
  )
}


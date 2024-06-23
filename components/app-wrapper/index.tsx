"use client"
import { Navbar } from "../navbar";
import { useInputs } from "./inputs";
import { AppWrapperWrapper, LoaderPlaceholder } from "./styles";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const inputs = useInputs();
  return (
    <>
      <LoaderPlaceholder
        if={!inputs.isReady}
      />
      <AppWrapperWrapper
        if={inputs.isReady}
        children={
          <>
            <Navbar />
            {children}
          </>
        }
      />
    </>
  )
}


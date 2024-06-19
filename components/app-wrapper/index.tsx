"use client"
import { Navbar } from "../navbar";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { AppWrapperWrapper, Drawer, Inner, LoaderPlaceholder, Menu } from "./styles";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <LoaderPlaceholder
        if={!inputs.isReady || inputs.showLoader}
      />
      <AppWrapperWrapper
        if={inputs.isReady}
        children={
          <>
            <Navbar
              if={inputs.headerExpanded}
            />
            <Inner
              children={
                <Drawer
                  position='left'
                  onShow={outputs.onShowDrawer}
                  show={inputs.showDrawer}
                  size={200}
                  menuContent={
                    <Menu
                      children={
                        <>
                          <div>one</div>
                          <div>one</div>
                          <div>one</div>
                        </>
                      }
                    />
                  }
                  mainContent={children}
                />
              }
            />
          </>
        }
      />
    </>
  )
}


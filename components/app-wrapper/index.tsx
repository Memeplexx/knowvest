"use client"
import { BiLogOutCircle } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { GrConfigure, GrTest } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { PiPlugsConnectedFill, PiStudentFill } from "react-icons/pi";
import { Frag } from "../html";
import { useInputs } from "./inputs";
import { AppWrapperWrapper, LoaderPlaceholder, MenuContent, MenuItem, MenuItemLineSeparator, MenuItemLink, MenuItemSeparator, SideNavWrapper, TopBar } from "./styles";

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
            <TopBar
              if={!inputs.isMobileWidth}
            />
            <Frag
              if={!inputs.isMobileWidth}
              children={children}
            />
            <SideNavWrapper
              if={inputs.isMobileWidth}
              style={{ zIndex: 9 }}
              onShow={inputs.store.showMenu.$set}
              show={inputs.showMenu}
              size={280}
              position="left"
              menuContent={
                <>
                  <MenuContent
                    onClick={() => inputs.store.showMenu.$set(false)}
                    children={
                      <>
                        <MenuItemLink
                          href="./home"
                          $active={inputs.routerPathName === '/app/home'}
                          children={
                            <>
                              <FiEdit />
                              Active Note
                            </>
                          }
                        />
                        <MenuItemLink
                          href="./related"
                          $active={inputs.routerPathName === '/app/related'}
                          children={
                            <>
                              <PiPlugsConnectedFill />
                              View Related
                            </>
                          }
                        />
                        <MenuItemLink
                          href="./active-flash-cards"
                          $active={inputs.routerPathName === '/app/active-flash-cards'}
                          children={
                            <>
                              <GrTest />
                              Flash Cards
                            </>
                          }
                        />
                        <MenuItemLineSeparator />
                        <MenuItemLink
                          href="./search"
                          $active={inputs.routerPathName === '/app/search'}
                          children={
                            <>
                              <IoSearch />
                              Search
                            </>
                          }
                        />
                        <MenuItemLink
                          href="./history"
                          $active={inputs.routerPathName === '/app/history'}
                          children={
                            <>
                              <MdHistory />
                              History
                            </>
                          }
                        />
                        <MenuItemLink
                          href="./test"
                          $active={inputs.routerPathName === '/app/test'}
                          children={
                            <>
                              <PiStudentFill />
                              Test Me
                            </>
                          }
                        />
                        <MenuItemSeparator />
                        <MenuItemLink
                          href="./tag-manager"
                          $active={inputs.routerPathName === '/app/tag-manager'}
                          children={
                            <>
                              <GrConfigure />
                              Tag Manager
                            </>
                          }
                        />
                        <MenuItem
                          children={
                            <>
                              <CiSettings />
                              App Settings
                            </>
                          }
                        />
                        <MenuItemSeparator />
                        <MenuItem
                          children={
                            <>
                              <BiLogOutCircle />
                              Sign Out
                            </>
                          }
                        />
                      </>
                    }
                  />
                </>
              }
              mainContent={children}
            />
          </>
        }
      />
    </>
  )
}

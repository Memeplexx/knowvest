"use client"
import { SideNav } from "@/components/sidenav";
import { useState } from "react";
import { AppWrapperWrapper, MenuContent } from "./styles";

export default function AppWrapper() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <AppWrapperWrapper
      children={
        <SideNav
          onShow={() => setShowMenu(true)}
          show={showMenu}
          size={280}
          edgeThreshold={25}
          position="left"
          menuContent={
            <MenuContent
              onClick={() => setShowMenu(false)}
              children='XXXXXXXXXX'
            />
          }
          mainContent={
            <div
              onClick={() => setShowMenu(b => !b)}
            >'Some Content'</div>
          }
        />
      }
    />
  )
}

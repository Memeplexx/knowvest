'use server'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }: React.PropsWithChildren) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())
  
  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager
      sheet={styledComponentsStyleSheet.instance}
      // shouldForwardProp={prop => isPropValid(prop)}
    >
      {children}
    </StyleSheetManager>
  )
}
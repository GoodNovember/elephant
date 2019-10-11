import React, { useState } from 'react'
import { PHPFileInspector } from './PHPFileInspector.js'
import { useFileSelectorDialog } from '../hooks/useFileSelectorDialog.js'
import styled from 'styled-components'

import { FancyButton } from './FancyButton.js'

const defaultFile = `/Users/victor/Desktop/demo.php`

const AppHolder = styled.div`
display: flex;
flex-direction: column;
border: 1px solid black;
height: 100vh;
`

export const App = () => {
  const [ targetFile, setTargetFile ] = useState(defaultFile)
  const openDialog = useFileSelectorDialog((newFile) => {
    setTargetFile(newFile)
  })
  return (
    <AppHolder>
      <FancyButton onClick={openDialog}>Select A File</FancyButton>
      <PHPFileInspector targetFile={targetFile} />
    </AppHolder>
  )
}

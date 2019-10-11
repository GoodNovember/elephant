import React from 'react'

import styled from 'styled-components'

import { FancyButton } from './FancyButton.js'

import { useFileContents } from '../hooks/useFileContents.js'
import { usePHPStream } from '../hooks/usePHPStream.js'
import { useFileWatcher } from '../hooks/useFileWatcher.js'
import { useTimestampTrigger } from '../hooks/useTimestampTrigger.js'
import { usePHPVersion } from '../hooks/usePHPVersion.js'
import { useOpenInEditorTrigger } from '../hooks/useOpenInEditorTrigger.js'

const SplitWindow = styled.div`
  display: flex;
`

const StylishWindowPane = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 50%;
  height: 100%;
  padding: 1rem;
`

const StylishFile = styled.div`
  display: flex;
  padding: 0 1rem;
  flex-direction: column;
  border: 1px solid blue;
`

const StylishStandardOutput = styled.div`
:not(:empty){
  display: flex;
  padding: 1rem;
  flex-direction: column;
  border: 1px solid green;
  font-family: monospace;
  white-space: 'pre';
  overflow: auto;
}
`

const StylishStandardError = styled.div`
:not(:empty){
  display: flex;
  padding: 1rem;
  flex-direction: column;
  border: 1px solid red;
  font-family: monospace;
  color: red;
  white-space: pre;
  overflow: auto;
}
`

const StylishCommandError = styled.div`
:not(:empty){
  padding: 1rem;
  border: 1px solid red;
  white-space: pre;
  color: red;
  font-family: monospace;
  /* word-wrap: break-word; */
  overflow: auto;
}
`

const StylishRenderableHTML = styled.div`
  border: 1px solid black;
`

const StylishPHPVersion = styled.div`
  font-family: monospace;
  white-space: pre;
  word-wrap: break-word;
  overflow-x: auto;
  flex-shrink: 0;
  margin: .5rem;
`

export const PHPFileInspector = ({ targetFile }) => {
  const [ ts, triggerTS ] = useTimestampTrigger()
  const openInEditor = useOpenInEditorTrigger(targetFile)
  const phpVersion = usePHPVersion()

  const fileContent = useFileContents(targetFile, ts)
  const {
    errors,
    stdout,
    stderr
  } = usePHPStream(targetFile, ts)

  const isWatching = useFileWatcher(targetFile,
    (filename, root, stat) => {
      triggerTS()
    }
  )

  return (
    <SplitWindow>
      <StylishWindowPane>
        <StylishPHPVersion>{phpVersion}</StylishPHPVersion>
        <StylishFile>
          <pre>{fileContent}</pre>
        </StylishFile>
        <FancyButton onClick={openInEditor}>Open File in Editor</FancyButton>
      </StylishWindowPane>
      <StylishWindowPane>
        <pre>{isWatching ? `Watching For Changes` : 'Waking Up...'}</pre>
        <pre>TargetFile: {targetFile}</pre>
        <StylishCommandError>{errors}</StylishCommandError>
        <h3>Standard Error <small>(from the console)</small></h3>
        <StylishStandardError>{stderr}</StylishStandardError>
        <h3>Standard Out <small>(from the console)</small></h3>
        <StylishStandardOutput>{stdout}</StylishStandardOutput>
        <h3>HTML <small>(converted Standard Out)</small></h3>
        <StylishRenderableHTML dangerouslySetInnerHTML={{ __html: stdout }} />
      </StylishWindowPane>
    </SplitWindow>
  )
}

import React, { useState } from 'react'

import styled from 'styled-components'

import { FancyButton } from './FancyButton.js'

import { useFileContents } from '../hooks/useFileContents.js'
import { usePHPStream } from '../hooks/usePHPStream.js'
import { useFileWatcher } from '../hooks/useFileWatcher.js'
import { useTimestampTrigger } from '../hooks/useTimestampTrigger.js'
import { usePHPVersion } from '../hooks/usePHPVersion.js'
import { useOpenInEditorTrigger } from '../hooks/useOpenInEditorTrigger.js'

import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-php'
import 'ace-builds/src-noconflict/theme-github'

const SplitWindow = styled.div`
  display: flex;
`

const StylishWindowPane = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  padding: 1rem;
`

const StylishFile = styled(AceEditor)`
  border: 1px solid blue;
  font-family: 'dank mono';
  font-size: 1rem;
`

const StylishStandardOutput = styled.div`
:not(:empty){
  display: flex;
  padding: 1rem;
  flex-direction: column;
  border: 1px solid green;
  font-family: monospace;
  white-space: pre-wrap;
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
  white-space: pre-wrap;
  overflow: auto;
}
`

const StylishCommandError = styled.div`
:not(:empty){
  padding: 1rem;
  border: 1px solid red;
  white-space: pre-wrap;
  color: red;
  font-family: monospace;
  /* word-wrap: break-word; */
  overflow: auto;
}
`

const StylishRenderableHTML = styled.div`
  border: 1px solid black;
  padding: 0 1rem;
`

const StylishPHPVersion = styled.div`
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
  flex-shrink: 0;
  margin: .5rem;
`

const StylishCommand = styled.div`
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
  flex-shrink: 0;
  margin: .5rem;
`

export const PHPFileInspector = ({ targetFile }) => {
  const [ ts, triggerTS ] = useTimestampTrigger()
  const [ argumentString, setArgumentString ] = useState('')
  const openInEditor = useOpenInEditorTrigger(targetFile)
  const phpVersion = usePHPVersion()

  const fileContent = useFileContents(targetFile, ts)
  const {
    errors,
    stdout,
    stderr,
    command
  } = usePHPStream(targetFile, argumentString, ts)

  const isWatching = useFileWatcher(targetFile,
    (filename, root, stat) => {
      triggerTS()
    }
  )

  return (
    <SplitWindow>
      <StylishWindowPane>
        <StylishPHPVersion>{phpVersion}</StylishPHPVersion>
        <StylishFile value={fileContent} mode='php' theme='github' width='100%' readOnly='true' />
        <FancyButton onClick={openInEditor}>Open File in Editor</FancyButton>
      </StylishWindowPane>
      <StylishWindowPane>
        <pre>{isWatching ? `Watching For Changes` : 'Waking Up...'}</pre>
        <h3>Arguments</h3>
        <input type='text' value={argumentString} onChange={(event) => {
          setArgumentString(`${event.target.value}`)
        }} />
        <pre>TargetFile: {targetFile}</pre>
        <h3>Console Command</h3>
        <StylishCommand>{command}</StylishCommand>
        {
          errors.length > 0
            ? (
              <div>
                <h3>Elephant Runtime Error</h3>
                <StylishCommandError>{errors}</StylishCommandError>
              </div>
            )
            : null
        }
        {
          stderr.length > 0
            ? (
              <div>
                <h3>Standard Error <small>(from the console)</small></h3>
                <StylishStandardError>{stderr}</StylishStandardError>
              </div>
            )
            : null
        }
        <h3>Standard Out <small>(from the console)</small></h3>
        <StylishStandardOutput>{stdout}</StylishStandardOutput>
        <h3>HTML <small>(converted Standard Out)</small></h3>
        <StylishRenderableHTML dangerouslySetInnerHTML={{ __html: stdout }} />
      </StylishWindowPane>
    </SplitWindow>
  )
}

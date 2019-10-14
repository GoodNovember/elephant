import { useEffect, useState } from 'react'

const { exec } = require('child_process')

export const usePHPStream = (filePath, argumentString, lastUpdate = 0) => {
  const [errors, setErrors] = useState([])
  const [stdout, setStdOut] = useState([])
  const [stderr, setStdErr] = useState([])

  const clearErrors = () => setErrors([])
  const clearStdOut = () => setStdOut([])
  const clearStdErr = () => setStdErr([])
  const addError = item => setErrors(existingErrors => ([...existingErrors, item]))
  const addStdOut = item => setStdOut(existing => ([...existing, item]))
  const addStdErr = item => setStdErr(existing => ([...existing, item]))

  const basicCommand = `php "${filePath}"`

  let finalCommand = basicCommand

  if (argumentString && argumentString.length > 0) {
    finalCommand = `${finalCommand} ${argumentString}`
  }

  useEffect(() => {
    clearErrors()
    clearStdOut()
    clearStdErr()
    exec(`${finalCommand}`, (err, stdoutStr, stderrStr) => {
      if (err) {
        addError(err.toString())
      } else {
        if (stdoutStr) {
          addStdOut(stdoutStr)
        }
        if (stderrStr) {
          addStdErr(stderrStr)
        }
      }
    })
  }, [filePath, argumentString, lastUpdate])
  return {
    errors,
    stdout,
    stderr,
    command: finalCommand
  }
}

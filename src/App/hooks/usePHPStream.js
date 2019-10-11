import { useEffect, useState } from 'react'

const { exec } = require('child_process')

export const usePHPStream = (filePath, lastUpdate = 0) => {
  const [errors, setErrors] = useState([])
  const [stdout, setStdOut] = useState([])
  const [stderr, setStdErr] = useState([])

  const clearErrors = () => setErrors([])
  const clearStdOut = () => setStdOut([])
  const clearStdErr = () => setStdErr([])
  const addError = item => setErrors(existingErrors => ([...existingErrors, item]))
  const addStdOut = item => setStdOut(existing => ([...existing, item]))
  const addStdErr = item => setStdErr(existing => ([...existing, item]))

  useEffect(() => {
    clearErrors()
    clearStdOut()
    clearStdErr()
    exec(`php "${filePath}"`, (err, stdoutStr, stderrStr) => {
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
  }, [filePath, lastUpdate])
  return {
    errors,
    stdout,
    stderr
  }
}

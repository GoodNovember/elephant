import { useEffect, useState } from 'react'

const { exec } = require('child_process')

export const usePHPVersion = () => {
  const [version, setVersion] = useState('')

  useEffect(() => {
    setVersion('')
    exec(`php --version`, (err, stdoutStr, stderrStr) => {
      if (err) {

      } else {
        if (stdoutStr) {
          setVersion(stdoutStr)
        }
        if (stderrStr) {

        }
      }
    })
  }, [])
  return version
}

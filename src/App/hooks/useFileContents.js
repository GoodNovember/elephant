import { useEffect, useState } from 'react'
import fs from 'fs'
export const useFileContents = (filePath, lastUpdate = 0) => {
  const [fileContents, setFileContents] = useState('')
  useEffect(() => {
    setFileContents('')

    fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
      if (err) {
        console.error(err)
      } else {
        setFileContents(content)
      }
    })

    return () => {
      setFileContents('')
    }
  }, [filePath, lastUpdate])
  return fileContents
}

import { useEffect } from 'react'
import path from 'path'

const element = document.createElement('input')
element.type = 'file'
element.accepts = 'text/php,.php'

export const useFileSelectorDialog = onNewFileCallback => {
  const openNewFile = () => {
    element.click()
  }

  useEffect(() => {
    const handler = (event) => {
      const { files: [file] } = event.target
      if (file) {
        if (path.extname(file.path) === '.php') {
          onNewFileCallback(file.path)
        } else {
          console.error(`Error, Elephant only accepts .php files.`, path.extname(file.path), file.path)
        }
      }
    }
    element.addEventListener('change', handler)
    return () => {
      element.removeEventListener('change', handler)
    }
  }, [])

  return openNewFile
}

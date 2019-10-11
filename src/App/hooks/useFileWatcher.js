import { useEffect, useState } from 'react'
import path from 'path'
import sane from 'sane'

let watcher = null

const glob = '*.php'

export const useFileWatcher = (targetFilePath, onChangeCallback) => {
  const [isReady, setIsReady] = useState(false)

  const onReadyHandler = () => {
    setIsReady(true)
  }

  const onChangeHandler = (fileName, fileDirectory, stat) => {
    const changedFilePath = path.join(fileDirectory, fileName)
    if (targetFilePath === changedFilePath) {
      onChangeCallback()
    }
  }

  const onDeleteHandler = (fileName, fileDirectory) => {
    const deletedFilePath = path.join(fileDirectory, fileName)
    if (targetFilePath === deletedFilePath) {
      if (watcher) {
        watcher.close()
        setIsReady(false)
      }
    }
  }

  useEffect(() => {
    setIsReady(false)

    if (watcher) {
      watcher.close()
      watcher = sane(path.dirname(targetFilePath), { glob })
      watcher.on('ready', onReadyHandler)
      watcher.on('change', onChangeHandler)
      watcher.on('delete', onDeleteHandler)
    } else {
      watcher = sane(path.dirname(targetFilePath), { glob })
      watcher.on('ready', onReadyHandler)
      watcher.on('change', onChangeHandler)
      watcher.on('delete', onDeleteHandler)
    }

    return () => {
      watcher.close()
    }
  }, [targetFilePath])

  return isReady
}

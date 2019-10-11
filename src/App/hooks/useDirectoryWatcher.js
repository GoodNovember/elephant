import { useEffect, useState } from 'react'
import sane from 'sane'
export const useDirectoryWatcher = (dirPath, {
  glob = '*.php',
  onChange = [],
  onAdd = [],
  onDelete = []
}) => {
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    setIsReady(false)

    const watcher = sane(dirPath, { glob })

    watcher.on('ready', () => {
      setIsReady(true)
    })

    watcher.on('change', (filepath, root, stat) => {
      onChange.forEach(cb => cb(filepath, root, stat))
    })

    watcher.on('add', (filepath, root, stat) => {
      onAdd.forEach(cb => cb(filepath, root, stat))
    })

    watcher.on('delete', (filepath, root) => {
      onDelete.forEach(cb => cb(filepath, root))
    })

    return () => {
      watcher.close()
    }
  }, [dirPath])

  return isReady
}

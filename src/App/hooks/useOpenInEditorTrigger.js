import openInEditor from 'open-in-editor'
export const useOpenInEditorTrigger = filePath => {
  const trigger = ({ line = 0, column = 0 }) => {
    const editor = openInEditor.configure({
      editor: 'code'
    })
    if (line !== 0 || column !== 0) {
      editor.open(`${filePath}:${line}:${column}`)
    } else {
      editor.open(filePath)
    }
  }
  return trigger
}

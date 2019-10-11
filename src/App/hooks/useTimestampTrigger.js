import { useState } from 'react'
export const useTimestampTrigger = () => {
  const [value, setValue] = useState(Date.now())
  const trigger = () => {
    setValue(Date.now())
  }
  return [
    value,
    trigger
  ]
}

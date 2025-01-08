import { useState } from 'react'
import { backendFetch } from '../utils/fetch'

export default function AddRemoveButton ({ id, isSaved: _isSaved }) {
  const [isSaved, setIsSaved] = useState(_isSaved)

  const handleAddRemove = async () => {
    const newIsSaved = !isSaved
    setIsSaved(newIsSaved)
    // TODO - Implementar array de ids
    const response = await backendFetch('/spotify/addremove', { method: 'POST', body: JSON.stringify({ tracks: [id] }) })
    Object.entries(response.data).forEach(([key, value]) => {
      if (value.includes(id)) {
        // magic string !
        if (key === 'added') {
          if (newIsSaved !== true) setIsSaved(true)
        } else {
          if (newIsSaved !== false) setIsSaved(false)
        }
      }
    })
  }
  return (
    <button onClick={handleAddRemove}>
      {isSaved
        ? '✖'
        : '➕'}
    </button>
  )
}

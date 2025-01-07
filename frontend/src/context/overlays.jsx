import { createContext, useState } from 'react'

export const OverlaysContext = createContext()

export const OverlaysProvider = ({ children }) => {
  const [leftOverlay, setLeftOverlay] = useState(null)
  const [rightOverlay, setRightOverlay] = useState(null)

  const openLeftOverlay = (overlay) => setLeftOverlay(overlay)
  const closeLeftOverlay = () => setLeftOverlay(null)
  const openRightOverlay = (overlay) => setRightOverlay(overlay)
  const closeRightOverlay = () => setRightOverlay(null)

  return (
    <OverlaysContext.Provider value={{
      leftOverlay,
      openLeftOverlay,
      closeLeftOverlay,
      rightOverlay,
      openRightOverlay,
      closeRightOverlay
    }}
    >
      {children}
    </OverlaysContext.Provider>
  )
}

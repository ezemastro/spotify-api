import { useContext } from 'react'
import { OverlaysContext } from '../context/overlays'

export const useOverlays = () => {
  return useContext(OverlaysContext)
}

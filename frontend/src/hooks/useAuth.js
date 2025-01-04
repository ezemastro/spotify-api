import { useContext } from 'react'
import { AuthContext } from '../context/auth'

export const useAuth = () => {
  const authContext = useContext(AuthContext)
  return {
    isSession: authContext.username !== null,
    username: authContext.username,
    setUsername: authContext.setUsername,
    isSpotifyLinked: authContext.isSpotifyLinked,
    setIsSpotifyLinked: authContext.setIsSpotifyLinked
  }
}

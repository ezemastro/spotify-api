import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(window.localStorage.getItem('username') ?? null)
  const [isSpotifyLinked, setIsSpotifyLinked] = useState(window.localStorage.getItem('isSpotifyLinked') === 'true')

  const newUsername = (username) => {
    window.localStorage.setItem('username', username)
    setUsername(username)
  }
  const newIsSpotifyLinked = (isSpotifyLinked) => {
    window.localStorage.setItem('isSpotifyLinked', isSpotifyLinked)
    setIsSpotifyLinked(isSpotifyLinked)
  }

  return (
    <AuthContext.Provider value={{
      username,
      setUsername: newUsername,
      isSpotifyLinked,
      setIsSpotifyLinked: newIsSpotifyLinked
    }}
    >

      {children}
    </AuthContext.Provider>
  )
}

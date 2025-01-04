import { useContext } from 'react'
import { AuthContext } from '../context/auth'
import LoginButton from './LoginButton'
import RegisterButton from './RegisterButton'
import UserButton from './UserButton'
import LinkSpotifyButton from './LinkSpotifyButton'

export default function NavSession () {
  const { username } = useContext(AuthContext)

  return (
    <div>
      {username
        ? (
          <>
            <p>{username}</p>
            <UserButton />
          </>
          )
        : (
          <>
            <LoginButton />
            <RegisterButton />
          </>
          )}
      <LinkSpotifyButton />
    </div>
  )
}

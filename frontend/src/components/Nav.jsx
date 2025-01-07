import { Link } from 'react-router-dom'
import NavAnchor from './NavAnchor'
import LibraryButton from './LibraryButton'
import NavUser from './NavUser'
import { useAuth } from '../hooks/useAuth'
import LinkSpotifyButton from './LinkSpotifyButton'

export default function Nav () {
  const { isSession, isSpotifyLinked } = useAuth()

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Link to='/'><h1>Guessify</h1></Link>
      {isSession
        ? (
          <>
            <div>
              {isSpotifyLinked
                ? (
                  <>
                    <NavAnchor to='/search' type='navigation'>Search</NavAnchor>
                    <NavAnchor to='/games' type='navigation'>Games</NavAnchor>
                  </>
                  )
                : (
                  <LinkSpotifyButton />
                  )}
            </div>
            <div>
              {isSpotifyLinked && <LibraryButton />}
              <NavUser />
            </div>
          </>
          )
        : (
          <div>
            <NavAnchor to='/login' type='login'>Login</NavAnchor>
            <NavAnchor to='/register' type='register'>Register</NavAnchor>
          </div>
          )}
    </nav>
  )
}

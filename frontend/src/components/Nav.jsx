import { Link } from 'react-router-dom'
import NavAnchor from './NavAnchor'
import LibraryButton from './LibraryButton'
import NavUser from './NavUser'
import { useAuth } from '../hooks/useAuth'

export default function Nav () {
  const { isSession } = useAuth()

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Link to='/'><h1>Guessify</h1></Link>
      {isSession
        ? (
          <>
            <div>
              <NavAnchor to='/search' type='navigation'>Search</NavAnchor>
              <NavAnchor to='/games' type='navigation'>Games</NavAnchor>
            </div>
            <div>
              <LibraryButton />
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

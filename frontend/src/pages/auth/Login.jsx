import { useAuth } from '../../hooks/useAuth.js'
import { backendFetch } from '../../utils/fetch.js'
import { useNavigate } from 'react-router-dom'

export default function Login () {
  const { setUsername, setIsSpotifyLinked } = useAuth()
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await backendFetch('/login', { method: 'POST', body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }) })

    // TODO - manejo de error
    console.log(response)
    if (response.ok) {
      setUsername(response.data.username)
      setIsSpotifyLinked(response.data.isSpotifyLinked)
      navigate('/', { replace: true })
    }
  }

  return (
    <form action='' onSubmit={handleLogin}>
      <input type='text' name='username' placeholder='Username' />
      <input type='password' name='password' placeholder='Password' />
      <button type='submit'>Login</button>
    </form>
  )
}

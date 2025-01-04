import { useNavigate, useSearchParams } from 'react-router-dom'
import { backendFetch } from '../utils/fetch'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth'

export default function Callback () {
  const { setUsername } = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // TODO - manejo de error
  if (searchParams.get('error')) console.log(searchParams.get('error'))

  useEffect(() => {
    if (!searchParams.get('code')) return
    ;(async () => {
      const response = await backendFetch('/spotify/callback?' + searchParams.toString())
      // TODO - manejo de error
      setUsername(response.data.username)
      // TODO - leer response para notificar si fue exitoso o no
      navigate('/', { replace: true })
    })()
  }, [searchParams, navigate, setUsername])
  return (
    <></>
  )
}

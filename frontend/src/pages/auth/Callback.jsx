import { useNavigate, useSearchParams } from 'react-router-dom'
import { backendFetch } from '../../utils/fetch'
import { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../../context/auth'

export default function Callback () {
  const { setIsSpotifyLinked } = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const fetchSent = useRef(false)
  // TODO - manejo de error
  if (searchParams.get('error')) console.log(searchParams.get('error'))

  useEffect(() => {
    if (!searchParams.get('code') || fetchSent.current) return
    ;(async () => {
      fetchSent.current = true
      await backendFetch('/spotify/callback?' + searchParams.toString())
      // TODO - manejo de error
      setIsSpotifyLinked(true)
      // TODO - leer response para notificar si fue exitoso o no
      navigate('/', { replace: true })
    })()
  }, [searchParams, navigate, setIsSpotifyLinked])
  return (
    <></>
  )
}

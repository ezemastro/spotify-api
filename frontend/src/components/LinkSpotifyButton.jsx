import { backendFetch } from '../utils/fetch.js'

export default function LinkSpotifyButton () {
  const handleLinkSpotify = async (e) => {
    e.preventDefault()
    await backendFetch('/spotify/link', { method: 'POST' })
  }

  return (
    <button onClick={handleLinkSpotify}>LinkSpotifyButton</button>
  )
}

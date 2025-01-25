import { useEffect, useRef } from 'react'
import { backendFetch } from '../utils/fetch'

export const useWebPlayblackSDK = ({ statusToPlayerCreated, statusToPlayerReady, statusToPlayerTransfered }) => {
  const player = useRef(null)
  const playerId = useRef(null)

  const tranferPlayer = () => {
    backendFetch(`/spotify/player/transfer/${playerId.current}`).then(() => statusToPlayerTransfered())
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      player.current = new window.Spotify.Player({
        name: 'Guessify Player',
        getOAuthToken: cb => {
          backendFetch('/spotify/token').then(response => cb(response.data.token))
        },
        volume: 0
      })

      player.current.addListener('ready', ({ device_id: deviceId }) => {
        playerId.current = deviceId
        statusToPlayerReady()
      })

      player.current.connect()
      statusToPlayerCreated()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { player, playerId, tranferPlayer }
}

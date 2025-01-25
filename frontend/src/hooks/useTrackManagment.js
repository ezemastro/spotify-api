import { useEffect, useState } from 'react'
import { backendFetch } from '../utils/fetch'

export function useTrackManagment ({ player, status, statusToPlayerTransfered, statusToPlayerTrackReady, STATUS_CODES }) {
  const [track, setTrack] = useState({ })
  const [playbackState, setPlaybackState] = useState({})
  const [volume, setVolume] = useState(parseFloat(window.localStorage.getItem('volume') ?? 0.5))

  const updateVolume = (volume) => {
    window.localStorage.setItem('volume', volume)
    setVolume(volume)
    if (status === STATUS_CODES.player_track_ready) { player.current.setVolume(volume) }
  }

  const newTrack = async (id) => {
    if (status > STATUS_CODES.player_transfered) statusToPlayerTransfered()
    if (id) {
      setTrack({ id })
    } else {
      const response = await backendFetch('/random-track')
      setTrack({ id: response.data.track.id })
    }
  }
  useEffect(() => {
    if (track.id && !track.name) fetchTrackInfo(track.id)
  }, [track])
  const fetchTrackInfo = async (id) => {
    const response = await backendFetch(`/spotify/track/${id}`)
    if (response.ok) {
      setTrack(response.data.track)
    }
  }

  const setupPlayerTrack = async (track) => {
    player.current.setVolume(0)
    await backendFetch('/spotify/player/track/' + track, {
      method: 'PUT'
    })

    const handlerAutoPause = (state) => {
      if (state.loading) return
      if (state.playback_speed > 0) {
        player.current.pause()
      }
      if (state.paused) {
        player.current.removeListener('player_state_changed', handlerAutoPause)
        player.current.setVolume(volume)
        statusToPlayerTrackReady()
      }
    }
    player.current.addListener('player_state_changed', handlerAutoPause)
  }

  const getPlaybackState = async (state) => {
    if (!state) {
      state = await player.current.getCurrentState()
    }
    setPlaybackState(state)
    return state
  }

  useEffect(() => {
    if (status === STATUS_CODES.player_transfered && track.id) {
      setupPlayerTrack(track.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STATUS_CODES, status, track])

  return { track, playbackState, newTrack, getPlaybackState, updateVolume }
}

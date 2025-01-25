import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GuessingInput from '../../components/GuessingInput'
import { GUESS_TYPES } from '../../config'
import { useWebPlayblackSDK } from '../../hooks/useWebPlayblackSDK'
import { useTrackManagment } from '../../hooks/useTrackManagment'

const STATUS_CODES = {
  idle: 0,
  player_created: 1,
  player_ready: 2,
  player_transfered: 3,
  player_track_ready: 4
}

export default function SongGuess () {
  const [status, setStatus] = useState(STATUS_CODES.idle)
  const statusToPlayerCreated = () => setStatus(STATUS_CODES.player_created)
  const statusToPlayerReady = () => setStatus(STATUS_CODES.player_ready)
  const statusToPlayerTransfered = () => setStatus(STATUS_CODES.player_transfered)
  const statusToPlayerTrackReady = () => setStatus(STATUS_CODES.player_track_ready)

  const { player, playerId, tranferPlayer } = useWebPlayblackSDK({ statusToPlayerCreated, statusToPlayerReady, statusToPlayerTransfered })

  const { track, playbackState, newTrack, getPlaybackState } = useTrackManagment({ player, status, playerId, statusToPlayerTrackReady, statusToPlayerTransfered, STATUS_CODES })
  const [urlParams] = useSearchParams()
  const [guesses, setGuesses] = useState([])
  const positionInputRef = useRef()
  const positionSpanRef = useRef()

  const isUrlTrackReaded = useRef(false)
  useEffect(() => {
    if (isUrlTrackReaded.current) return
    newTrack(urlParams.get('track'))
    isUrlTrackReaded.current = true
  }, [urlParams, newTrack])
  const isUrlGuessesReaded = useRef(false)
  useEffect(() => {
    if (!isUrlGuessesReaded.current && urlParams.get('guesses')) {
      setGuesses(urlParams.get('guesses').split(',').filter(guess => Object.values(GUESS_TYPES).includes(guess)))
    }
    if (status === STATUS_CODES.player_track_ready) {
      isUrlGuessesReaded.current = true
    }
  }, [urlParams, status])
  useEffect(() => {
    if (status === STATUS_CODES.player_transfered && isUrlGuessesReaded.current) {
      setGuesses([])
    }
  }, [status])

  useEffect(() => {
    if (!isUrlGuessesReaded.current || !isUrlTrackReaded.current) return
    if (track.id) {
      window.history.replaceState(null, '', `?track=${track.id}`)
    }
    if (guesses.length > 0) {
      window.history.replaceState(null, '', `?track=${track.id}&guesses=` + guesses.join(','))
    }
  }, [track, guesses])

  const handleGuess = (guess) => {
    setGuesses([...guesses, guess])
  }

  const intervalRef = useRef(undefined)
  useEffect(() => {
    if (!playbackState) return
    if (!playbackState.paused && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        getPlaybackState()
      }, 1000)
    }
    if (playbackState.paused && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [playbackState, getPlaybackState])

  useEffect(() => {
    const playerRef = player.current
    const handleStateChange = (state) => {
      getPlaybackState(state)
    }
    if (status === STATUS_CODES.player_track_ready) {
      playerRef.addListener('player_state_changed', handleStateChange)
    }
    return () => {
      playerRef?.removeListener('player_state_changed', handleStateChange)
    }
  }, [status, player, getPlaybackState])

  useEffect(() => {
    const handleSeek = (e) => player.current?.seek(e.target.value)
    const positionInput = positionInputRef.current
    positionInput.addEventListener('change', handleSeek)
    return () => { positionInput.removeEventListener('change', handleSeek) }
  }, [player])

  return (
    <>
      <h1>Guess the song</h1>
      {status === STATUS_CODES.player_ready && <button onClick={() => tranferPlayer()}>Transfer player</button>}
      <section>
        <div>
          <div>
            <img
              src={guesses.includes(GUESS_TYPES.album) ? track.album?.image.url : ''}
              alt={guesses.includes(GUESS_TYPES.album) ? 'Album image of ' + track.name : ''}
            />
          </div>
          <div>
            <div>
              <GuessingInput
                placeholder='Song name'
                answer={track.name}
                onGuess={handleGuess}
                guessed={guesses.includes(GUESS_TYPES.name)}
                name={GUESS_TYPES.name}
                statusChange={status === STATUS_CODES.player_transfered}
              />
            </div>
            <div>
              <div>
                <GuessingInput
                  placeholder='Artist'
                  answer={track.artists}
                  onGuess={handleGuess}
                  guessed={guesses.includes(GUESS_TYPES.artist)}
                  name={GUESS_TYPES.artist}
                  statusChange={status === STATUS_CODES.player_transfered}
                />
              </div>
              <div>
                <GuessingInput
                  placeholder='Album'
                  answer={track.album?.name}
                  onGuess={handleGuess}
                  guessed={guesses.includes(GUESS_TYPES.album)}
                  name={GUESS_TYPES.album}
                  statusChange={status === STATUS_CODES.player_transfered}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button>⏯</button>
          <button onClick={() => player.current.togglePlay()}>▶</button>
          <button>▶ 1s</button>
        </div>
        <div>
          <span ref={positionSpanRef}>
            {playbackState?.position
              ? Math.trunc(playbackState.position / 1000 / 60) + ':' + ('0' + Math.trunc(playbackState.position / 1000 % 60)).slice(-2)
              : '0:00'}
          </span>
          <input
            ref={positionInputRef}
            disabled={status !== STATUS_CODES.player_track_ready}
            type='range'
            name='postion'
            min={0}
            max={track.duration}
            onInput={(e) => {
              positionSpanRef.current.textContent = Math.trunc(e.target.value / 1000 / 60) + ':' + ('0' + Math.trunc(e.target.value / 1000 % 60)).slice(-2)
            }}
          />
          <span>{track.duration
            ? Math.trunc(track.duration / 1000 / 60) + ':' + ('0' + Math.trunc(track.duration / 1000 % 60)).slice(-2)
            : '0:00'}
          </span>
        </div>
        <div>
          <button disabled={status !== STATUS_CODES.player_track_ready}>⏮</button>
          <button disabled={status !== STATUS_CODES.player_track_ready}>↩</button>
          <button disabled={status !== STATUS_CODES.player_track_ready}>❓</button>
          <button disabled={status !== STATUS_CODES.player_track_ready}>↪</button>
          <button disabled={status !== STATUS_CODES.player_track_ready} onClick={() => newTrack()}>⏭</button>
        </div>
      </section>
    </>
  )
}

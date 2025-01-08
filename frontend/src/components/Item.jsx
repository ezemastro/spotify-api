import { SPOTIFY_ITEM_TYPES } from '../config'
import PlayButton from './PlayButton'
import AddRemoveButton from './AddRemoveButton'
import { useOverlays } from '../hooks/useOverlays'

export default function Item ({ type, name, image, id, isSaved, ...props }) {
  const { openLeftOverlay } = useOverlays()
  if (type === SPOTIFY_ITEM_TYPES.track) image = props.album.image

  const handleClick = (e) => {
    openLeftOverlay({ type, name, image, id })
  }

  return (
    <li key={id} onClick={handleClick} role={type !== SPOTIFY_ITEM_TYPES.track ? 'button' : null} tabIndex={type !== SPOTIFY_ITEM_TYPES.track ? 0 : null}>
      <img src={image?.url} alt={name} />
      <section>
        <h3>{name}</h3>
        {type === SPOTIFY_ITEM_TYPES.track && <p>{props.artists.map(artist => artist.name).join(', ')} - {props.album.name}</p>}
        {type === SPOTIFY_ITEM_TYPES.album && <p>{props.artists.map(artist => artist.name).join(', ')}</p>}
        {type === SPOTIFY_ITEM_TYPES.playlist && <p>{props.owner.name}</p>}
      </section>
      <section>
        <PlayButton />
        {type === SPOTIFY_ITEM_TYPES.track && <AddRemoveButton id={id} isSaved={isSaved} />}
      </section>
    </li>
  )
}

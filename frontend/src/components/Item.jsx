import { SPOTIFY_ITEM_TYPES } from '../config'
import PlayButton from './PlayButton'
import AddRemoveButton from './AddRemoveButton'

export default function Item ({ key, type, name, image, ...props }) {
  if (type === SPOTIFY_ITEM_TYPES.track) image = props.album.image

  return (
    <li key={key}>
      <button>
        <img src={image?.url} alt={name} />
        <section>
          <h3>{name}</h3>
          {type === SPOTIFY_ITEM_TYPES.track && <p>{props.artists.map(artist => artist.name).join(', ')} - {props.album.name}</p>}
          {type === SPOTIFY_ITEM_TYPES.album && <p>{props.artists.map(artist => artist.name).join(', ')}</p>}
          {type === SPOTIFY_ITEM_TYPES.playlist && <p>{props.owner.name}</p>}
        </section>
        <section>
          <PlayButton />
          {type === SPOTIFY_ITEM_TYPES.track && <AddRemoveButton />}
        </section>
      </button>
    </li>
  )
}

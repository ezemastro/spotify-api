const findImage = (images, size) => (images.findLast(image => image.width >= size) ?? images[0]) ?? null

export const spotifyTrackFormatter = (track, { imgSize } = {}) => {
  if (!track) return
  return {
    type: track.type,
    album: spotifyAlbumFormatter(track.album, { imgSize }),
    artists: track.artists.map(artist => spotifyArtistFormatter(artist)),
    duration: Math.floor(track.duration_ms / 1000),
    explicit: track.explicit,
    id: track.id,
    is_playable: track.is_playable,
    name: track.name
  }
  // is local?
}

export const spotifyAlbumFormatter = (album, { imgSize = 0 } = {}) => {
  if (!album) return
  const image = findImage(album.images, imgSize)

  return {
    type: album.type,
    id: album.id,
    name: album.name,
    image: {
      url: image?.url,
      size: image?.width
    },
    artists: album.artists.map(artist => spotifyArtistFormatter(artist))
  }
}

export const spotifyArtistFormatter = (artist, { imgSize = 0 } = {}) => {
  if (!artist) return
  const image = findImage(artist.images ?? [], imgSize)

  return {
    id: artist.id,
    name: artist.name,
    type: artist.type,
    image: image
      ? {
          url: image?.url,
          size: image?.width
        }
      : null
  }
}

export const spotifyPlaylistFormatter = (playlist, { imgSize = 0 } = {}) => {
  if (!playlist) return
  const image = findImage(playlist.images, imgSize)
  return {
    description: playlist.description,
    id: playlist.id,
    image: {
      url: image?.url,
      size: image?.width
    },
    name: playlist.name,
    owner: {
      id: playlist.owner.id,
      name: playlist.owner.display_name,
      type: playlist.owner.type
    },
    type: playlist.type
  }
}

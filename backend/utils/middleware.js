import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV, S_CLIENT_ID, S_CLIENT_SECRET } from '../config.js'
import { User } from './db.js'

export const authMiddleware = async (req, res, next) => {
  const { token, spotify_token: spotifyToken, spotify_token_expiration: spotifyTokenExpiration } = req.cookies

  if (!token) {
    req.session = null
    return next()
  }

  // error si esta vencido
  const { user_id: userId, is_s_linked: isSpotifyLinked } = jwt.verify(token, JWT_SECRET)
  if (!userId) {
    req.session = null
    return next()
  }

  req.session = { id: userId, isSpotifyLinked, spotifyToken, spotifyTokenExpiration }
}
export const spotifyMiddleware = async (req, res, next) => {
  if (!req.session?.isSpotifyLinked) return next()

  if (!req.session.spotifyToken || (new Date(parseInt(req.session.spotifyTokenExpiration)) < new Date())) {
    console.log('Spotify token expired')
    req.session.user = await User.findById(req.session.id)
    const { spotify_refresh_token: spotifyRefreshToken } = req.session.user

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(S_CLIENT_ID + ':' + S_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: spotifyRefreshToken
      })
    })

    // TODO - manejo de error
    if (response.ok) {
      const { expires_in: expiresIn, access_token: accessToken } = await response.json()
      const expiration = new Date().getTime() + parseInt(expiresIn) * 1000

      req.session.spotifyToken = accessToken
      req.session.spotifyTokenExpiration = expiration

      res.cookie('spotify_token', accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: parseInt(expiresIn) * 1000
      }).cookie('spotify_token_expiration', expiration)
    }
  }
  return next()
}

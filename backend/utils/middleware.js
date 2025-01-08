import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV, S_CLIENT_ID, S_CLIENT_SECRET } from '../config.js'
import { User } from './db.js'

export const authMiddleware = async (req, res, next) => {
  const { token, spotify_token_expiration: spotifyTokenExpiration } = req.cookies
  let { spotify_token: spotifyToken } = req.cookies

  if (!token) {
    req.session = null
    return next()
  }

  // error si esta vencido
  const { userId } = jwt.verify(token, JWT_SECRET)
  if (!userId) {
    req.session = null
    return next()
  }

  let user
  // Check spotify token expiration
  if (spotifyTokenExpiration && new Date(parseInt(spotifyTokenExpiration)) < new Date()) {
    console.log('Spotify token expired')
    user = await User.findById(userId)
    const { spotify_refresh_token: spotifyRefreshToken } = user

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
      const { expires_in: expiresIn, ...data } = await response.json()
      spotifyToken = data.access_token

      res.cookie('spotify_token', spotifyToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: parseInt(expiresIn) * 1000
      }).cookie('spotify_token_expiration', new Date().getTime() + parseInt(expiresIn) * 1000)
    }
  }

  req.session = { id: userId, spotifyToken, user }
  return next()
}

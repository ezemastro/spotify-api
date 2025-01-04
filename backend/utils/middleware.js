import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export const authMiddleware = async (req, res, next) => {
  const { token, spotify_token: spotifyToken } = req.cookies

  if (!token) return next()

  const { userId } = jwt.verify(token, JWT_SECRET)
  if (!userId) return next()

  req.session = { id: userId, spotifyToken }

  return next()
}

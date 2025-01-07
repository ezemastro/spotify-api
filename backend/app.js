import './env.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { User, connection } from './utils/db.js'
import { userSchema } from './utils/schemas.js'
import { hashPassword, comparePassword } from './utils/hash.js'
import { authMiddleware } from './utils/middleware.js'
import { CALLBACK_URL, JWT_SECRET, NODE_ENV, PORT, S_CLIENT_ID, S_CLIENT_SECRET, SCOPES, TOKEN_EXPIRATION } from './config.js'
import { spotifyAlbumFormatter, spotifyArtistFormatter, spotifyPlaylistFormatter, spotifyTrackFormatter } from './utils/spotifyItemsFormatter.js'

const app = express()
// TODO - evitar que se caiga cuando se envia mal el body
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use('/spotify', authMiddleware)

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing username, email or password' })
  }

  const { success: isValid } = userSchema.safeParse({ username, password, email })
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid username, email or password' })
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] })
  if (existingUser) {
    return res.status(400).json({ error: 'Username or email already in use' })
  }

  const hashedPassword = await hashPassword(password)

  const user = new User({ username, email, password: hashedPassword })
  user.save().then(() => {
    res.status(201).json({ message: 'User created successfully' })
  })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' })
  }

  const user = await User.findOne({ username })
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const isCorrectPassword = await comparePassword(password, user.password)
  if (!isCorrectPassword) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  // Posible error si esta vencido
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
    noTimestamp: true
  })

  res.cookie('token', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: TOKEN_EXPIRATION
  }).status(200).json({ message: 'Login successful', username, isSpotifyLinked: user.spotify_refresh_token !== null })
})

app.post('/spotify/link', async (req, res) => {
  if (!req.session?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  res.json({
    redirect: (
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        client_id: S_CLIENT_ID,
        response_type: 'code',
        redirect_uri: CALLBACK_URL,
        scope: SCOPES.join(' ')
        // implementar state con un hash del username o similar
      })
    )
  })
})

app.get('/spotify/callback', async (req, res) => {
  const { code } = req.query
  if (!code) {
    return res.status(400).json({ error: 'Missing code' })
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(S_CLIENT_ID + ':' + S_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: CALLBACK_URL
    })
  })

  const responseData = await response.json()

  if (responseData.error) {
    return res.status(400).json({ error: responseData.error })
  }

  const user = await User.findById(req.session.id)
  user.spotify_refresh_token = responseData.refresh_token
  await user.save()

  res
    .cookie('spotify_token', responseData.access_token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: parseInt(responseData.expires_in) * 1000
    })
    .cookie('spotify_token_expiration', new Date().getTime() + parseInt(responseData.expires_in) * 1000)
    .status(201).json({ message: 'Account linked to Spotify successfully' })
})

app.get('/spotify/search', async (req, res) => {
  if (!req.session?.spotifyToken) return res.status(401).json({ error: 'Unauthorized' })
  const { q, type = 'track', limit, offset } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })

  const response = await fetch(`https://api.spotify.com/v1/search?${new URLSearchParams({ q, type, limit, offset }).toString()}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + req.session.spotifyToken
    }
  })
  // TODO - manejo de error
  const data = await response.json()

  const formattedData = {}

  data.tracks && (formattedData.tracks = {
    limit: data.tracks.limit,
    offset: data.tracks.offset,
    items: data.tracks.items.map(track => spotifyTrackFormatter(track))
  })
  data.albums && (formattedData.albums = {
    limit: data.albums.limit,
    offset: data.albums.offset,
    items: data.albums.items.map(album => spotifyAlbumFormatter(album))
  })
  data.artists && (formattedData.artists = {
    limit: data.artists.limit,
    offset: data.artists.offset,
    items: data.artists.items.map(artist => spotifyArtistFormatter(artist))
  })
  data.playlists && (formattedData.playlists = {
    limit: data.playlists.limit,
    offset: data.playlists.offset,
    items: data.playlists.items.map(playlist => spotifyPlaylistFormatter(playlist))
  })

  res.status(200).json(formattedData)
})

app.post('/spotify/disconnect', async (req, res) => {
  const user = await User.findById(req.session.id)
  user.spotify_refresh_token = null
  user.save()
  res.status(200).json({ message: 'Spotify account disconnected successfully' })
})

app.listen(PORT, () => {
  console.log(`Listening on port: http://localhost:${PORT}`)
})

process.on('SIGINT', async () => {
  connection.close()
  process.exit(0)
})

export const {
  PORT = 3000,
  NODE_ENV,
  DB_URI,
  SALT_ROUNDS = 10,
  JWT_SECRET,
  TOKEN_EXPIRATION,
  CALLBACK_URL,
  S_CLIENT_ID,
  S_CLIENT_SECRET
} = process.env

export const SCOPES = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-follow-modify',
  'user-follow-read',
  'user-read-playback-position',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read'
]

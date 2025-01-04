import mongoose from 'mongoose'
import { DB_URI } from '../config.js'

const { Schema } = mongoose

mongoose.connect(DB_URI)
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  spotify_refresh_token: String,
  saved_songs: [String]
})

export const User = mongoose.model('User', userSchema)
export const { connection } = mongoose

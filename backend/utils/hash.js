import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config.js'

// acceder mejor a las variables de entorno
export const hashPassword = async (password) => await bcrypt.hash(password, parseInt(SALT_ROUNDS) ?? 10)
export const comparePassword = async (password, hash) => await bcrypt.compare(password, hash)

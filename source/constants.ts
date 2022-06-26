import { config } from 'dotenv'
import { resolve } from 'path'

config()

// Override env vars with envoriment specific definitions
config({
  override: true,
  path: resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
})

// TODO: Validate with zod
export const APP_ENV: 'development' | 'production' | 'test' = process.env.NODE_ENV as any || 'development'
export const APP_PORT: number = parseInt(process.env.PORT || process.env.APP_PORT)
export const APP_DEBUG = process.env.APP_DEBUG === 'true'

export const CORS_ORIGIN = process.env.CORS_ORIGIN

export const SESSION_SECRET = process.env.SESSION_SECRET
export const SESSION_COOKIE = process.env.SESSION_COOKIE

export const DB_CONNECTION = process.env.DB_CONNECTION
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = parseInt(process.env.DB_PORT)
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD

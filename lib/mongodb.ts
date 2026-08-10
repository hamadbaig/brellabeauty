import mongoose from 'mongoose'
import { config as loadEnv } from 'dotenv'

if (!process.env.MONGODB_URI) {
  loadEnv({ path: '.env.local' })
  loadEnv({ path: '.env' })
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined. Set it in .env.local or .env')
}

const MONGODB_URI = process.env.MONGODB_URI as string

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = global.__mongooseCache ?? { conn: null, promise: null }
global.__mongooseCache = cache

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }

  cache.conn = await cache.promise
  return cache.conn
}

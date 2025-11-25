import mongoose, { type Connection } from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://lmsproass:BkUPrqGSLxc4LGoz@cluster0.lefbign.mongodb.net/lms-proj?appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Cached connection
const cached: { conn: Connection | null; promise: Promise<Connection> | null } = {
  conn: null,
  promise: null,
}

export async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose.connection
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

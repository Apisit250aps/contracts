import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env")
}

interface Connection {
  isConnected?: number
}

const connection: Connection = {}

async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  const db = await mongoose.connect(MONGODB_URI)
  connection.isConnected = db.connections[0].readyState
}

export default dbConnect

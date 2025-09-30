// ...existing code...
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI
if (!MONGO_URI) {
  console.error('Missing MongoDB URI. Set MONGO_URL or MONGO_URI in .env')
  process.exit(1)
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

connectDB()
export default mongoose
// ...existing code...
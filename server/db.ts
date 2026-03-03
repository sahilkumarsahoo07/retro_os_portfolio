import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGOURL;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Please check your .env file.",
  );
}

console.log("Attempting to connect to MongoDB...");
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

export const db = mongoose.connection;



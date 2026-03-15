const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Already connected hai toh reuse karo
  if (cached.conn) {
    return cached.conn;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    cached.conn = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;

  } catch (error) {
    cached.promise = null; // reset karo
    console.error(`❌ MongoDB Error: ${error.message}`);
    throw error; // ← error throw karo, ignore mat karo!
  }
};

module.exports = connectDB;

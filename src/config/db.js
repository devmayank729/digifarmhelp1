const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Test the connection with a quick ping
    await conn.connection.db.admin().ping();
    console.log('🏓 MongoDB ping successful');

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Make sure MongoDB is running:');
    console.error('   1. Start MongoDB service: net start MongoDB');
    console.error('   2. Or run: mongod --dbpath "C:\\data\\db"');
    console.error(`🔗 Connection String: ${process.env.MONGO_URI}`);
    process.exit(1);
  }
};

module.exports = connectDB;
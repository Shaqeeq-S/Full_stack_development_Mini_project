const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://new_user_31:newuser@shaqeeq.iuezwr5.mongodb.net/?appName=shaqeeq');
    console.log(`[MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

const dbConnect = async () => {
  const dbURI = process.env.DB_URL;

  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Unable to connect to MongoDB Atlas:', error.message);
  }
};

module.exports = dbConnect;

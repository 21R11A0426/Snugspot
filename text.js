require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8080;

const dburl = process.env.ATLASDB_URL;

async function main() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });
    console.log("✅ MongoDB Connected");

    app.listen(port, () => {
      console.log(`🚀 Server listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  }
}

main();

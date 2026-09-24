const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongodb connected");

  const port = process.env.PORT || 5000;
  return app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
// 📁 File: backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import chalk from 'chalk'; // ✅ Import chalk

const app = express();
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // ✅ or the port your React app runs on
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
.then(() => {
  console.log(chalk.bgGreen.black('✅ MongoDB connected'));
})
.catch((err) => {
  console.error(chalk.bgRed.white('❌ MongoDB connection error:'), err);
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.bgBlue.white(`🚀 Server running on port ${PORT}`));
});

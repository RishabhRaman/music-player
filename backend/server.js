import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ytmRoutes from './routes/ytm.js';
import homeRoutes from './routes/home.js';
import libraryRoutes from './routes/library.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ytm/home', homeRoutes);
app.use('/api/ytm', ytmRoutes);
app.use('/api/library', libraryRoutes);

// MongoDB Connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/music-player";
        await mongoose.connect(uri);
        console.log("MongoDB Database Connected Successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

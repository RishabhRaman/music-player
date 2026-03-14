import express from 'express';
import User from '../models/User.js';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// Mock Auth - Create or Get User (For testing without proper auth system)
router.post('/user', async (req, res) => {
    try {
        const { username } = req.body;
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle Liked Songs
router.post('/like', async (req, res) => {
    try {
        const { userId, track } = req.body;
        const user = await User.findById(userId);

        const exists = user.likedSongs.find(s => s.videoId === track.videoId);
        if (exists) {
            user.likedSongs = user.likedSongs.filter(s => s.videoId !== track.videoId); // Unlike
        } else {
            user.likedSongs.push(track); // Like
        }

        await user.save();
        res.json(user.likedSongs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Liked Songs
router.get('/liked/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user.likedSongs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

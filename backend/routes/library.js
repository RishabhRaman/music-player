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

// --- Playlist Routes ---

// Create Playlist
router.post('/playlist', async (req, res) => {
    try {
        const { userId, name, description } = req.body;
        if (!userId || !name) {
            return res.status(400).json({ error: 'User ID and Name are required' });
        }
        const playlist = new Playlist({ userId, name, description, tracks: [] });
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User's Playlists
router.get('/playlist/user/:userId', async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.params.userId }).sort('-createdAt');
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Track to Playlist
router.post('/playlist/add', async (req, res) => {
    try {
        const { playlistId, track } = req.body;
        const playlist = await Playlist.findById(playlistId);
        
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Check if track already exists
        const exists = playlist.tracks.find(t => t.videoId === track.videoId);
        if (exists) {
            return res.status(400).json({ error: 'Track already in playlist' });
        }

        playlist.tracks.push(track);
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Playlist
router.get('/playlist/:playlistId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

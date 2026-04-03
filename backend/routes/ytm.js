import express from 'express';
import youtubedl from 'youtube-dl-exec';
import ytSearch from 'yt-search';
import ytpl from 'ytpl';

const router = express.Router();

router.get('/stream/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Proxy the audio stream directly to the client instead of returning a URL.
        // This solves the 403 Forbidden issue caused by YouTube's IP-locked streams when backend and client IPs differ.
        const subprocess = youtubedl.exec(videoUrl, {
            output: '-',
            format: 'bestaudio',
        }, {
            stdio: ['ignore', 'pipe', 'ignore']
        });

        // Set headers for audio streaming
        res.set('Content-Type', 'audio/webm');
        res.set('Transfer-Encoding', 'chunked');

        // Pipe the stdout from yt-dlp to the Express response
        subprocess.stdout.pipe(res);

        // Handle client disconnect
        req.on('close', () => {
            subprocess.kill('SIGKILL');
        });

    } catch (error) {
        console.error("Stream Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

// Search
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Search query required' });

        const searchResults = await ytSearch(query);
        const formattedResults = searchResults.videos.slice(0, 15)
            .map(item => ({
                id: item.videoId,
                title: item.title,
                artist: item.author?.name || 'Unknown',
                thumbnail: item.image || item.thumbnail,
                duration: item.timestamp || '0:00'
            }));

        res.json(formattedResults);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get Playlist
router.get('/playlist/:id', async (req, res) => {
    try {
        const playlistId = req.params.id;
        const playlist = await ytpl(playlistId, { limit: 50 });

        const formattedTracks = playlist.items.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.author?.name || 'Unknown',
            thumbnail: item.bestThumbnail?.url || item.thumbnails?.[0]?.url,
            duration: item.duration
        }));

        res.json({
            title: playlist.title,
            author: playlist.author?.name,
            thumbnails: playlist.bestThumbnail?.url,
            tracks: formattedTracks
        });
    } catch (error) {
        console.error("Playlist Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

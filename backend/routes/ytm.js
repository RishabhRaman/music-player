import express from 'express';
import youtubedl from 'youtube-dl-exec';
import ytSearch from 'yt-search';
import ytpl from 'ytpl';

const router = express.Router();

// Get Stream URL
router.get('/stream/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const info = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
        });

        const audioFormats = info.formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
        
        if (audioFormats && audioFormats.length > 0) {
            // Pick best audio 
            const bestAudio = audioFormats.sort((a, b) => b.abr - a.abr)[0];
            res.json({ url: bestAudio.url });
        } else {
            res.status(404).json({ error: 'Audio stream not found' });
        }
    } catch (error) {
        console.error("Stream Error:", error);
        res.status(500).json({ error: error.message });
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

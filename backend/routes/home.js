import express from 'express';
import ytsr from 'ytsr';

const router = express.Router();

// ytsr doesn't easily support fetching a "home" page of recommendations without a search term.
// Let's implement a fallback using predefined searches for top mixes
router.get('/', async (req, res) => {
    try {
        const categories = [
            { id: "top", title: 'Top Hits', query: 'Top 50 songs playlist', type: 'playlist' },
            { id: "electronic", title: 'Electronic Mix', query: 'Electronic Dance Music playlist 2024', type: 'playlist' },
            { id: "lofi", title: 'Lofi Beats', query: 'lofi hip hop radio beats to relax study to', type: 'video' }
        ];

        const results = await Promise.all(categories.map(async (cat) => {
            const searchResults = await ytsr(cat.query, { limit: 10 });

            const filtered = searchResults.items.filter(i => i.type === cat.type).map(i => ({
                id: i.id || i.playlistID,
                title: i.title,
                thumbnail: i.bestThumbnail?.url || i.thumbnails?.[0]?.url || i.firstVideo?.bestThumbnail?.url,
                author: i.author?.name || 'Various Artists',
                type: cat.type
            }));

            return {
                title: cat.title,
                items: filtered.slice(0, 5) // Return top 5 for each category
            }
        }));

        res.json(results);
    } catch (error) {
        console.error("Home Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

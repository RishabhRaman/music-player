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
                id: cat.id,
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

// New route to fetch an expanded list for a specific section
router.get('/section/:id', async (req, res) => {
    try {
        const sectionId = req.params.id;
        const categories = [
            { id: "top", title: 'Top Hits', query: 'Top 50 songs playlist', type: 'playlist' },
            { id: "electronic", title: 'Electronic Mix', query: 'Electronic Dance Music playlist 2024', type: 'playlist' },
            { id: "lofi", title: 'Lofi Beats', query: 'lofi hip hop radio beats to relax study to', type: 'video' }
        ];

        const category = categories.find(c => c.id === sectionId);
        
        if (!category) {
            return res.status(404).json({ error: 'Section not found' });
        }

        const searchResults = await ytsr(category.query, { limit: 30 }); // Fetch more for 'Show All'
        
        // Filter out channels/shelves, keep videos and playlists
        const validItems = searchResults.items.filter(i => i.type === 'video' || i.type === 'playlist');
        
        const formatted = validItems.map(i => ({
            id: i.id || i.playlistID,
            title: i.title,
            thumbnail: i.bestThumbnail?.url || i.thumbnails?.[0]?.url || i.firstVideo?.bestThumbnail?.url,
            author: i.author?.name || 'Various Artists',
            type: i.type
        }));

        res.json({
            title: category.title,
            items: formatted.slice(0, 20) // Return top 20
        });

    } catch (error) {
        console.error("Section Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

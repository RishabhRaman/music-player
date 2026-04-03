import express from 'express';
import ytSearch from 'yt-search';

const router = express.Router();

// yt-search doesn't easily support fetching a "home" page of recommendations without a search term.
// Let's implement a fallback using predefined searches for top mixes
router.get('/', async (req, res) => {
    try {
        const categories = [
            { id: "top", title: 'Top Hits', query: 'Top 50 songs playlist', type: 'playlist' },
            { id: "electronic", title: 'Electronic Mix', query: 'Electronic Dance Music playlist 2024', type: 'playlist' },
            { id: "lofi", title: 'Lofi Beats', query: 'lofi hip hop radio beats to relax study to', type: 'video' }
        ];

        const results = await Promise.all(categories.map(async (cat) => {
            const searchResults = await ytSearch(cat.query);

            let items = [];
            if (cat.type === 'video') {
                items = searchResults.videos.slice(0, 5).map(i => ({
                    id: i.videoId,
                    title: i.title,
                    thumbnail: i.thumbnail || i.image,
                    author: i.author?.name || 'Various Artists',
                    type: 'video'
                }));
            } else if (cat.type === 'playlist') {
                items = searchResults.playlists.slice(0, 5).map(i => ({
                    id: i.listId,
                    title: i.title,
                    thumbnail: i.thumbnail || i.image,
                    author: i.author?.name || 'Various Artists',
                    type: 'playlist'
                }));
            }

            return {
                id: cat.id,
                title: cat.title,
                items: items
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

        const searchResults = await ytSearch(category.query);
        
        let formatted = [];
        if (category.type === 'video') {
             formatted = searchResults.videos.slice(0, 20).map(i => ({
                 id: i.videoId,
                 title: i.title,
                 thumbnail: i.thumbnail || i.image,
                 author: i.author?.name || 'Various Artists',
                 type: 'video'
             }));
        } else {
             formatted = searchResults.playlists.slice(0, 20).map(i => ({
                 id: i.listId,
                 title: i.title,
                 thumbnail: i.thumbnail || i.image,
                 author: i.author?.name || 'Various Artists',
                 type: 'playlist'
             }));
        }

        res.json({
            title: category.title,
            items: formatted // Return top 20
        });

    } catch (error) {
        console.error("Section Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search as SearchIcon } from 'lucide-react';
import TrackList from '../components/TrackList';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async (searchQuery) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/api/ytm/search?q=${searchQuery}`);
            setResults(data);
        } catch (err) {
            console.error('Search failed:', err);
            setError('Failed to fetch results. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <div className="search-input-container">
                    <SearchIcon size={20} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Music heals, Heal yourself now..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="search-content">
                {loading && <div className="loading-state">Searching for "{query}"...</div>}
                {error && <div className="error-state">{error}</div>}

                {!loading && !error && results.length > 0 && (
                    <div className="search-results-section">
                        <h2 className="section-title">Songs</h2>
                        <TrackList tracks={results.slice(0, 10)} showHeader={false} />
                    </div>
                )}

                {!loading && !error && results.length === 0 && query.trim() !== '' && (
                    <div className="empty-state">No results found for "{query}"</div>
                )}

                {!loading && !error && query.trim() === '' && (
                    <div className="browse-all">
                        <h2 className="section-title">Browse all</h2>
                        <div className="category-tags">
                            <div className="category-pill" onClick={() => setQuery('Trending')}>Trending Now</div>
                            <div className="category-pill" onClick={() => setQuery('Top Global')}>Top Global</div>
                            <div className="category-pill" onClick={() => setQuery('New Releases')}>New Releases</div>
                            <div className="category-pill" onClick={() => setQuery('Workout')}>Workout</div>
                            <div className="category-pill" onClick={() => setQuery('Chill Vibes')}>Chill Vibes</div>
                            <div className="category-pill" onClick={() => setQuery('Party Anthems')}>Party Anthems</div>
                            <div className="category-pill" onClick={() => setQuery('Focus & Study')}>Focus & Study</div>
                            <div className="category-pill" onClick={() => setQuery('Acoustic')}>Acoustic</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;

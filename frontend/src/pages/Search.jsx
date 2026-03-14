import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            const { data } = await axios.get(`http://localhost:5000/api/ytm/search?q=${searchQuery}`);
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
                        placeholder="What do you want to listen to?"
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
                        <div className="category-grid">
                            <div className="category-card" style={{ backgroundColor: '#E13300' }}>Podcasts</div>
                            <div className="category-card" style={{ backgroundColor: '#1E3264' }}>Made For You</div>
                            <div className="category-card" style={{ backgroundColor: '#E8115B' }}>New Releases</div>
                            <div className="category-card" style={{ backgroundColor: '#8D67AB' }}>Pop</div>
                            <div className="category-card" style={{ backgroundColor: '#E91429' }}>Hip-Hop</div>
                            <div className="category-card" style={{ backgroundColor: '#B02897' }}>Rock</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;

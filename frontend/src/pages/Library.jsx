import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrackList from '../components/TrackList';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { Play } from 'lucide-react';
import './Library.css';

const Library = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayer();
    const { user, setIsLoginModalOpen } = useAuth();

    useEffect(() => {
        const fetchLikedSongs = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch liked songs
                const { data: songs } = await axios.get(`http://localhost:5000/api/library/liked/${user._id}`);
                setLikedSongs(songs);
            } catch (error) {
                console.error("Failed to fetch library", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedSongs();
    }, [user]);

    const handlePlayLiked = () => {
        if (likedSongs.length > 0) {
            playTrack(likedSongs[0], likedSongs);
        }
    }

    if (loading) {
        return <div className="library-loading"><div className="spinner"></div></div>;
    }

    if (!user) {
        return (
            <div className="library-page">
                <div className="library-header gradient-bg">
                    <div className="library-hero-info">
                        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Log in to view Library</h1>
                        <button className="upgrade-btn" style={{ width: 'fit-content' }} onClick={() => setIsLoginModalOpen(true)}>Log In</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="library-page">
            <div className="library-header gradient-bg">
                <div className="library-hero-icon shadow-xl">
                    <HeartIcon />
                </div>
                <div className="library-hero-info">
                    <span>Playlist</span>
                    <h1>Liked Songs</h1>
                    <div className="library-stats">
                        <span className="user-name">testuser</span>
                        <span className="dot">•</span>
                        <span>{likedSongs.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="library-content">
                <div className="library-controls">
                    <button
                        className="play-all-btn shadow-lg"
                        onClick={handlePlayLiked}
                        disabled={likedSongs.length === 0}
                    >
                        <Play fill="currentColor" size={28} style={{ marginLeft: '4px' }} />
                    </button>
                </div>

                <div className="songs-container">
                    <TrackList tracks={likedSongs} />
                </div>
            </div>
        </div>
    );
};

// Custom heart icon for the hero graphic
const HeartIcon = () => (
    <svg role="img" height="64" width="64" viewBox="0 0 24 24" fill="white">
        <path d="M8.667 3.018a5.617 5.617 0 0 0-3.344 1.258A6.353 6.353 0 0 0 3 9.434c0 1.956.764 3.737 2.152 5.048L12 21.054l6.848-6.572A7.108 7.108 0 0 0 21 9.434a6.353 6.353 0 0 0-2.323-5.158 5.617 5.617 0 0 0-3.344-1.258 5.545 5.545 0 0 0-3.333 1.252A5.545 5.545 0 0 0 8.667 3.018z"></path>
    </svg>
)

export default Library;

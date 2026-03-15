import React from 'react';
import TrackList from '../components/TrackList';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Play } from 'lucide-react';
import './Library.css';

const Library = () => {
    const { playTrack } = usePlayer();
    const { user, setIsLoginModalOpen } = useAuth();
    const { likedSongs, loadingLibrary } = useLibrary();

    const handlePlayLiked = () => {
        if (likedSongs.length > 0) {
            playTrack(likedSongs[0], likedSongs);
        }
    }

    if (loadingLibrary) {
        return <div className="library-loading"><div className="spinner"></div></div>;
    }

    if (!user) {
        return (
            <div className="liked-songs-page">
                <div className="liked-songs-header">
                    <div className="liked-hero-info">
                        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Log in to view Library</h1>
                        <button className="upgrade-btn" style={{ width: 'fit-content' }} onClick={() => setIsLoginModalOpen(true)}>Log In</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="liked-songs-page">
            <div className="liked-songs-header">
                <div className="liked-hero-info">
                    <h1>Liked Songs</h1>
                    <div className="liked-stats">
                        <span className="user-name">{user?.username || 'testuser'}</span>
                        <span className="dot">•</span>
                        <span>{likedSongs.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="liked-content">
                <div className="liked-controls">
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

export default Library;

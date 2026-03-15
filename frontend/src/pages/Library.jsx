import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Heart, ListMusic, PlusSquare } from 'lucide-react';
import './Library.css'; // New CSS for this page

const Library = () => {
    const { user, setIsLoginModalOpen } = useAuth();
    const { likedSongs, playlists, loadingLibrary, setIsPlaylistModalOpen } = useLibrary();
    const navigate = useNavigate();

    if (loadingLibrary) {
        return <div className="library-loading"><div className="spinner"></div></div>;
    }

    if (!user) {
        return (
            <div className="library-overview-page">
                <div className="library-header gradient-bg">
                    <div className="library-hero-info">
                        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Log in to view your Library</h1>
                        <button className="upgrade-btn" style={{ width: 'fit-content' }} onClick={() => setIsLoginModalOpen(true)}>Log In</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="library-overview-page">
            <div className="library-header">
                <div className="library-hero-info">
                    <h1>Your Library</h1>
                    <div className="library-stats">
                        <span className="user-name">{user.username}</span>
                        <span className="dot">•</span>
                        <span>{playlists.length} Playlists</span>
                        <span className="dot">•</span>
                        <span>{likedSongs.length} Liked Songs</span>
                    </div>
                </div>
            </div>

            <div className="library-content-grid">
                
                {/* Liked Songs Tile */}
                <div className="library-card liked-songs-card" onClick={() => navigate('/liked')}>
                    <div className="card-bg-gradient"></div>
                    <div className="card-content">
                        <div className="card-texts">
                            <h2>Liked Songs</h2>
                            <p>{likedSongs.length} liked songs</p>
                        </div>
                        <div className="card-icon glass-panel">
                            <Heart size={32} fill="white" color="white" />
                        </div>
                    </div>
                </div>

                {/* Playlists */}
                {playlists.map(playlist => (
                    <div className="library-card playlist-card" key={playlist._id} onClick={() => navigate(`/playlist/${playlist._id}`)}>
                        <div className="card-image-placeholder glass-panel">
                            <ListMusic size={48} color="rgba(255,255,255,0.2)" />
                        </div>
                        <div className="card-info">
                            <h3>{playlist.name}</h3>
                            <p>{playlist.tracks.length} tracks</p>
                        </div>
                    </div>
                ))}

                {/* Create Playlist Tile */}
                <div className="library-card create-card" onClick={() => setIsPlaylistModalOpen(true)}>
                    <div className="card-image-placeholder glass-panel create-icon">
                        <PlusSquare size={48} color="var(--text-muted)" />
                    </div>
                    <div className="card-info">
                        <h3>Create Playlist</h3>
                        <p>Build your collection</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Library;

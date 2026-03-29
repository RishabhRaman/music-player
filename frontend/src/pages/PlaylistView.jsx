import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import TrackList from '../components/TrackList';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { Play, Music } from 'lucide-react';
import './LikedSongs.css';
import './PlaylistView.css';

const PlaylistView = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayer();
    const { user, setIsLoginModalOpen } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlaylist = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/api/library/playlist/${id}`);
                setPlaylist(data);
            } catch (err) {
                console.error("Failed to fetch playlist", err);
                setError('Failed to load playlist');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPlaylist();
        }
    }, [id]);

    const handlePlayPlaylist = () => {
        if (playlist && playlist.tracks.length > 0) {
            playTrack(playlist.tracks[0], playlist.tracks);
        }
    }

    if (loading) {
        return <div className="library-loading"><div className="spinner"></div></div>;
    }

    if (error || !playlist) {
        return <div className="liked-songs-page"><h2 style={{ padding: '24px', color: 'white' }}>{error || 'Playlist not found'}</h2></div>;
    }

    if (!user) {
        return (
            <div className="liked-songs-page">
                <div className="liked-songs-header empty-header">
                    <div className="liked-hero-cover empty-cover shadow-2xl">
                        <Music size={64} color="rgba(255, 255, 255, 0.4)" strokeWidth={1} />
                    </div>
                    <div className="liked-hero-info">
                        <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-2px' }}>Log in to view Playlist</h1>
                        <button className="upgrade-btn" style={{ width: 'fit-content', padding: '12px 32px', fontSize: '1.1rem' }} onClick={() => setIsLoginModalOpen(true)}>Log In</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="liked-songs-page">
            <div className="liked-songs-header playlist-header-bg">
                <div className="liked-hero-cover shadow-2xl playlist-cover-bg">
                    {playlist.name ? <span className="playlist-icon-text">{playlist.name.charAt(0).toUpperCase()}</span> : <Music fill="white" size={80} color="white" />}
                </div>
                <div className="liked-hero-info">
                    <span className="hero-badge">Playlist</span>
                    <h1 style={{ fontSize: playlist.name.length > 15 ? '4rem' : '6.5rem' }}>{playlist.name}</h1>
                    <div className="liked-stats">
                        <span className="user-name">{user.username}</span>
                        <span className="dot">•</span>
                        <span>{playlist.tracks.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="liked-content">
                <div className="liked-controls">
                    <button
                        className="play-all-btn shadow-lg playlist-play-btn"
                        onClick={handlePlayPlaylist}
                        disabled={playlist.tracks.length === 0}
                    >
                        <Play fill="currentColor" size={28} style={{ marginLeft: '4px' }} />
                    </button>
                </div>

                <div className="songs-container">
                    <TrackList tracks={playlist.tracks} hideOptions={true} /> 
                </div>
            </div>
        </div>
    );
};

export default PlaylistView;

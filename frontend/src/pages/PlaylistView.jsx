import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TrackList from '../components/TrackList';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { Play } from 'lucide-react';
import '../pages/Library.css'; // Reuse library styles
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
                const { data } = await axios.get(`http://localhost:5000/api/library/playlist/${id}`);
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
        return <div className="library-page"><h2 style={{ padding: '24px' }}>{error || 'Playlist not found'}</h2></div>;
    }

    if (!user) {
        return (
            <div className="library-page">
                <div className="library-header gradient-bg">
                    <div className="library-hero-info">
                        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Log in to view Playlist</h1>
                        <button className="upgrade-btn" style={{ width: 'fit-content' }} onClick={() => setIsLoginModalOpen(true)}>Log In</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="library-page playlist-view-page">
            <div className="library-header gradient-bg">
                <div className="library-hero-icon shadow-xl playlist-hero-icon">
                    <span className="playlist-icon-text">{playlist.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="library-hero-info">
                    <span>Playlist</span>
                    <h1>{playlist.name}</h1>
                    <div className="library-stats">
                        <span className="user-name">{user.username}</span>
                        <span className="dot">•</span>
                        <span>{playlist.tracks.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="library-content">
                <div className="library-controls">
                    <button
                        className="play-all-btn shadow-lg"
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

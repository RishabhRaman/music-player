import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, MonitorSpeaker, Heart } from 'lucide-react';
import axios from 'axios';
import './NowPlayingBar.css';

const NowPlayingBar = () => {
    const { currentTrack, isPlaying, togglePlay, progress, duration, seek, handleNext, handlePrev, volume, setVolume, isLoading } = usePlayer();
    const { user, setIsLoginModalOpen } = useAuth();
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Check if current track is liked
        const checkLikedStatus = async () => {
            if (!currentTrack || !user) {
                setIsLiked(false);
                return;
            }
            try {
                const { data: songs } = await axios.get(`http://localhost:5000/api/library/liked/${user._id}`);
                setIsLiked(songs.some(s => s.videoId === currentTrack.id));
            } catch (error) {
                console.error("Failed to check liked status", error);
            }
        }
        checkLikedStatus();
    }, [currentTrack, user]);

    const handleLike = async () => {
        if (!currentTrack) return;

        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/library/like', {
                userId: user._id,
                track: {
                    videoId: currentTrack.id,
                    title: currentTrack.title,
                    artist: currentTrack.artist,
                    thumbnail: currentTrack.thumbnail,
                    duration: currentTrack.duration
                }
            });
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Failed to like track", error);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const calculateProgressPercent = () => {
        if (!duration) return 0;
        return (progress / duration) * 100;
    };

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * duration;
        seek(newTime);
    };

    const handleVolume = (e) => {
        setVolume(e.target.value / 100);
    };

    return (
        <div className="now-playing-bar glass-panel">
            <div className="track-info">
                {currentTrack ? (
                    <>
                        <img src={currentTrack.thumbnail} alt={currentTrack.title} className="track-art" />
                        <div className="track-details">
                            <div className="track-title">{currentTrack.title}</div>
                            <div className="track-artist">{currentTrack.artist}</div>
                        </div>
                        <button className="like-btn" onClick={handleLike}>
                            <Heart size={16} fill={isLiked ? "var(--accent-primary)" : "none"} color={isLiked ? "var(--accent-primary)" : "currentColor"} />
                        </button>
                    </>
                ) : (
                    <div className="empty-state">Select a track to play</div>
                )}
            </div>

            <div className="player-controls">
                <div className="control-buttons">
                    <button className="icon-btn" onClick={handlePrev}><SkipBack size={20} fill="currentColor" /></button>
                    <button className="play-btn" onClick={togglePlay} disabled={!currentTrack || isLoading}>
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : isPlaying ? (
                            <Pause size={24} fill="currentColor" />
                        ) : (
                            <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
                        )}
                    </button>
                    <button className="icon-btn" onClick={handleNext}><SkipForward size={20} fill="currentColor" /></button>
                </div>

                <div className="playback-bar">
                    <span className="time">{formatTime(progress)}</span>
                    <div className="progress-container">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={calculateProgressPercent()}
                            onChange={handleSeek}
                            className="progress-slider"
                        />
                        <div className="progress-fill" style={{ width: `${calculateProgressPercent()}%` }}></div>
                    </div>
                    <span className="time">{formatTime(duration)}</span>
                </div>
            </div>

            <div className="right-controls">
                <button className="icon-btn"><Mic2 size={16} /></button>
                <button className="icon-btn"><MonitorSpeaker size={16} /></button>
                <div className="volume-control">
                    <Volume2 size={20} />
                    <div className="volume-slider-container">
                        <input type="range" min="0" max="100" value={volume * 100} onChange={handleVolume} className="volume-slider" />
                        <div className="progress-fill" style={{ width: `${volume * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NowPlayingBar;

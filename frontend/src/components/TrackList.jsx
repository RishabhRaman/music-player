import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { Play, Heart, Plus } from 'lucide-react';
import './TrackList.css';
import './TrackListCustom.css';

const TrackList = ({ tracks, showHeader = true, hideOptions = false }) => {
    const { currentTrack, isPlaying, playTrack } = usePlayer();
    const { likedSongs, toggleLike, playlists, addToPlaylist } = useLibrary();
    const { user, setIsLoginModalOpen } = useAuth();
    const [openDropdownId, setOpenDropdownId] = useState(null);

    if (!tracks || tracks.length === 0) {
        return <div className="no-tracks">No tracks available</div>;
    }

    return (
        <>
            <div className="track-list">
                {showHeader && (
                <div className="track-list-header">
                    <div className="col-index">#</div>
                    <div className="col-title">Title</div>
                    <div className="col-album">Duration</div>
                </div>
            )}

            {tracks.map((track, index) => {
                const isCurrent = currentTrack?.id === track.id;
                const isLiked = likedSongs.some(s => s.videoId === track.videoId || s.id === track.id);
                const isDropdownOpen = openDropdownId === track.id;

                const handleLike = (e) => {
                    e.stopPropagation();
                    if (!user) {
                        setIsLoginModalOpen(true);
                        return;
                    }
                    toggleLike(track);
                };

                const handleToggleDropdown = (e) => {
                    e.stopPropagation();
                    if (!user) {
                        setIsLoginModalOpen(true);
                        return;
                    }
                    setOpenDropdownId(isDropdownOpen ? null : track.id);
                };

                const handleAddToPlaylist = async (e, playlistId) => {
                    e.stopPropagation();
                    await addToPlaylist(playlistId, track);
                    setOpenDropdownId(null);
                };

                return (
                    <div
                        key={track.id + index}
                        className={`track-item ${isCurrent ? 'active' : ''}`}
                        onClick={() => playTrack(track, tracks)}
                        onDoubleClick={() => playTrack(track, tracks)}
                    >
                        <div className="col-index">
                            <span className="index-number">{isCurrent && isPlaying ? <div className="playing-eq"><span></span><span></span><span></span></div> : index + 1}</span>
                            <button className="row-play-btn">
                                <Play fill="currentColor" size={16} style={{ marginLeft: '2px' }} />
                            </button>
                        </div>
                        <div className="col-title">
                            <img src={track.thumbnail} alt={track.title} className="list-track-art" />
                            <div className="list-track-info">
                                <span className={`list-track-name ${isCurrent ? 'text-accent' : ''}`}>{track.title}</span>
                                <span className="list-track-artist">{track.artist}</span>
                            </div>
                        </div>
                        <div className="col-album track-actions-row">
                            {!hideOptions && (
                                <div className="track-actions-container">
                                    <button 
                                        className={`action-btn heart-btn ${isLiked ? 'liked' : ''}`} 
                                        onClick={handleLike}
                                        title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                                    >
                                        <Heart size={18} fill={isLiked ? 'var(--accent-primary)' : 'none'} color={isLiked ? 'var(--accent-primary)' : 'currentColor'} />
                                    </button>
                                    
                                    <div className="playlist-dropdown-wrapper">
                                        <button 
                                            className="action-btn" 
                                            onClick={handleToggleDropdown}
                                            title="Add to Playlist"
                                        >
                                            <Plus size={20} />
                                        </button>
                                        
                                        {isDropdownOpen && (
                                            <div className="playlist-dropdown-menu">
                                                <div className="dropdown-header">Add to playlist</div>
                                                {playlists.length === 0 ? (
                                                    <div className="dropdown-empty">No playlists found</div>
                                                ) : (
                                                    playlists.map(p => (
                                                        <div 
                                                            key={p._id} 
                                                            className="dropdown-item"
                                                            onClick={(e) => handleAddToPlaylist(e, p._id)}
                                                        >
                                                            {p.name}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <span className="list-track-duration">{track.duration || '0:00'}</span>
                        </div>
                    </div>
                );
            })}
        </div>
        {openDropdownId && (
            <div className="dropdown-overlay" onClick={() => setOpenDropdownId(null)}></div>
        )}
    </>
    );
};

export default TrackList;

import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play } from 'lucide-react';
import './TrackList.css';

const TrackList = ({ tracks, showHeader = true }) => {
    const { currentTrack, isPlaying, playTrack } = usePlayer();

    if (!tracks || tracks.length === 0) {
        return <div className="no-tracks">No tracks available</div>;
    }

    return (
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

                return (
                    <div
                        key={track.id}
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
                        <div className="col-album">
                            <span className="list-track-duration">{track.duration || '0:00'}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TrackList;

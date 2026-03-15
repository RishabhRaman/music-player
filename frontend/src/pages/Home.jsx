import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { Play } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayer();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/ytm/home');
                setSections(data);
            } catch (error) {
                console.error("Failed to load home data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const handlePlayItem = async (item) => {
        if (item.type === 'video') {
            playTrack({
                id: item.id,
                title: item.title,
                artist: item.author,
                thumbnail: item.thumbnail
            });
        } else if (item.type === 'playlist') {
            // In a full implementation, you'd route to a Playlist details page or fetch the playlist tracks here and play the first one
            // For now, let's just log it
            console.log('Would navigate to playlist:', item.id);
        }
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (loading) {
        return (
            <div className="home-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <h1 className="greeting">{greeting()}</h1>

            {/* Mock 6-grid recent items */}
            <div className="recent-grid">
                {sections[0]?.items.slice(0, 6).map((item, idx) => (
                    <div key={`recent-${idx}`} className="recent-card glass-panel" onClick={() => handlePlayItem(item)}>
                        <img src={item.thumbnail} alt={item.title} />
                        <span className="recent-title">{item.title}</span>
                        <button className="play-button-overlay shadow-lg">
                            <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Dynamic Sections */}
            {sections.map((section, idx) => (
                <div key={idx} className="home-section">
                    <div className="section-header">
                        <h2 className="section-title">{section.title}</h2>
                        <span 
                            className="show-all" 
                            onClick={() => navigate(`/section/${section.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            Show all
                        </span>
                    </div>
                    <div className="card-grid">
                        {section.items.map((item, itemIdx) => (
                            <div key={`card-${itemIdx}`} className="media-card" onClick={() => handlePlayItem(item)}>
                                <div className="card-img-container">
                                    <img src={item.thumbnail} alt={item.title} className={`card-img ${item.type === 'artist' ? 'artist-img' : ''}`} />
                                    <button className="play-button-overlay shadow-lg">
                                        <Play size={24} fill="currentColor" style={{ marginLeft: '2px' }} />
                                    </button>
                                </div>
                                <div className="card-info">
                                    <h3 className="card-title">{item.title}</h3>
                                    <p className="card-subtitle">{item.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;

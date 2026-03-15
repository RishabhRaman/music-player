import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';
import { Play } from 'lucide-react';
import './SectionView.css'; 

const SectionView = () => {
    const { sectionId } = useParams();
    const navigate = useNavigate();
    const [sectionData, setSectionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayer();

    useEffect(() => {
        const fetchSection = async () => {
            try {
                // Fetch the expanded list of 20 items for this specific category
                const { data } = await axios.get(`http://localhost:5000/api/ytm/home/section/${sectionId}`);
                setSectionData(data);
            } catch (error) {
                console.error("Failed to load section data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSection();
    }, [sectionId]);

    const handlePlayItem = async (item) => {
        if (item.type === 'video') {
            playTrack({
                id: item.id,
                title: item.title,
                artist: item.author,
                thumbnail: item.thumbnail
            });
        }
    };

    if (loading) {
        return <div className="section-view-loading" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><div className="spinner"></div></div>;
    }

    if (!sectionData && !loading) {
        return (
            <div className="section-not-found" style={{padding: '32px'}}>
                <h2>Section not found</h2>
                <button onClick={() => navigate('/')} style={{marginTop: '16px', padding: '8px 16px', background: 'var(--accent-primary)', borderRadius: '24px'}}>Go Back Home</button>
            </div>
        );
    }
    
    if (!sectionData) return null;

    return (
        <div className="section-view-page">
            <div className="section-header gradient-bg">
                <h1>{sectionData.title}</h1>
            </div>
            
            <div className="section-content">
                <div className="card-grid">
                    {sectionData.items.map((item, itemIdx) => (
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
        </div>
    );
};

export default SectionView;

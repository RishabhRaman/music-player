import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.5rem' }}>O</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>rbit Music</span>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Home size={24} />
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Search size={24} />
                            <span>Search</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/library" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Library size={24} />
                            <span>Your Library</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-playlists">
                <div className="sidebar-action">
                    <div className="icon-wrapper glass-panel">
                        <PlusSquare size={20} />
                    </div>
                    <span>Create Playlist</span>
                </div>
                <div className="sidebar-action">
                    <div className="icon-wrapper glass-panel" style={{ background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))' }}>
                        <Heart size={20} fill="white" />
                    </div>
                    <span>Liked Songs</span>
                </div>
            </div>

            <div className="divider"></div>

            <div className="sidebar-user-playlists">
                {/* Mock playlists */}
                <p>Chill Vibes</p>
                <p>Workout Mix</p>
                <p>Discover Weekly</p>
            </div>

        </div>
    );
};

export default Sidebar;

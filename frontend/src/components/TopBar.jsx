import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TopBar.css';

const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setIsLoginModalOpen, logout } = useAuth();

    const isSearch = location.pathname === '/search';

    return (
        <div className={`top-bar ${isSearch ? 'solid-bg' : ''}`}>
            <div className="nav-buttons">
                <button className="nav-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <button className="nav-btn" onClick={() => navigate(1)}>
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="top-bar-right">
                <button className="upgrade-btn">Explore Premium</button>
                <button className="icon-btn-top">
                    <Bell size={18} />
                </button>

                {user ? (
                    <div className="user-menu-container">
                        <button className="user-btn logged-in" title={user.username}>
                            <span className="user-initial">{user.username.charAt(0).toUpperCase()}</span>
                        </button>
                        <button className="icon-btn-top logout-btn" onClick={logout} title="Log Out">
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button className="user-btn" onClick={() => setIsLoginModalOpen(true)} title="Log In">
                        <User size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopBar;

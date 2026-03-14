import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import NowPlayingBar from './components/NowPlayingBar';
import LoginModal from './components/LoginModal';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';
import './components/MainView.css'; // Add import for gradient background
import './index.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <PlayerProvider>
                    <div style={{ display: 'flex' }}>
                        <Sidebar />
                        <MainView />
                    </div>
                    <NowPlayingBar />
                    <LoginModal />
                </PlayerProvider>
            </Router>
        </AuthProvider>
    );
};

export default App;

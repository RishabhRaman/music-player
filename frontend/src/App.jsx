import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import NowPlayingBar from './components/NowPlayingBar';
import LoginModal from './components/LoginModal';
import PlaylistModal from './components/PlaylistModal';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import './components/MainView.css'; // Add import for gradient background
import './index.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <PlayerProvider>
                    <LibraryProvider>
                        <AppContent />
                    </LibraryProvider>
                </PlayerProvider>
            </Router>
        </AuthProvider>
    );
};

const AppContent = () => {
    const { isPlaylistModalOpen, setIsPlaylistModalOpen, createPlaylist } = useLibrary();

    const handleCreatePlaylist = async (name) => {
        await createPlaylist(name);
    };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <MainView />
            </div>
            <NowPlayingBar />
            <LoginModal />
            <PlaylistModal 
                isOpen={isPlaylistModalOpen} 
                onClose={() => setIsPlaylistModalOpen(false)} 
                onSubmit={handleCreatePlaylist} 
            />
        </>
    );
};

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from './TopBar';
import Search from '../pages/Search';
import Home from '../pages/Home';
import LikedSongs from '../pages/LikedSongs';
import Library from '../pages/Library';
import PlaylistView from '../pages/PlaylistView';
import SectionView from '../pages/SectionView';

const MainView = () => {
    return (
        <div className="main-view">
            <TopBar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/liked" element={<LikedSongs />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/playlist/:id" element={<PlaylistView />} />
                    <Route path="/section/:sectionId" element={<SectionView />} />
                </Routes>
            </div>
        </div>
    );
};

export default MainView;

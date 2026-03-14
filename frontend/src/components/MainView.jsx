import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from './TopBar';
import Search from '../pages/Search';
import Home from '../pages/Home';
import Library from '../pages/Library';

const MainView = () => {
    return (
        <div className="main-view">
            <TopBar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/library" element={<Library />} />
                </Routes>
            </div>
        </div>
    );
};

export default MainView;

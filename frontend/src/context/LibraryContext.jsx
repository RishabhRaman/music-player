import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
    const { user } = useAuth();
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loadingLibrary, setLoadingLibrary] = useState(true);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            setLikedSongs([]);
            setPlaylists([]);
            setLoadingLibrary(false);
            return;
        }

        const fetchLibraryData = async () => {
            setLoadingLibrary(true);
            try {
                const [likedRes, playlistsRes] = await Promise.all([
                    api.get(`/api/library/liked/${user._id}`),
                    api.get(`/api/library/playlist/user/${user._id}`)
                ]);
                setLikedSongs(likedRes.data);
                setPlaylists(playlistsRes.data);
            } catch (error) {
                console.error("Failed to fetch library data", error);
            } finally {
                setLoadingLibrary(false);
            }
        };

        fetchLibraryData();
    }, [user]);

    const toggleLike = async (track) => {
        if (!user) return false;
        try {
            const { data } = await api.post('/api/library/like', {
                userId: user._id,
                track
            });
            setLikedSongs(data);
            return true;
        } catch (error) {
            console.error("Failed to toggle like", error);
            return false;
        }
    };

    const createPlaylist = async (name) => {
        if (!user) return null;
        try {
            const { data } = await api.post('/api/library/playlist', {
                userId: user._id,
                name
            });
            setPlaylists([data, ...playlists]);
            return data;
        } catch (error) {
            console.error("Failed to create playlist", error);
            return null;
        }
    };

    const addToPlaylist = async (playlistId, track) => {
        if (!user) return false;
        try {
            await api.post('/api/library/playlist/add', {
                playlistId,
                track
            });
            // Optionally refetch playlists if we want to keep the local state perfectly in sync, 
            // but normally we only need the list of names here, except if we are viewing the playlist.
            return true;
        } catch (error) {
            console.error("Failed to add to playlist", error);
            return false;
        }
    };

    return (
        <LibraryContext.Provider value={{
            likedSongs,
            playlists,
            loadingLibrary,
            isPlaylistModalOpen,
            setIsPlaylistModalOpen,
            toggleLike,
            createPlaylist,
            addToPlaylist
        }}>
            {children}
        </LibraryContext.Provider>
    );
};

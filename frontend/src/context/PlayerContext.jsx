import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import api from '../utils/api';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [streamUrl, setStreamUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            handleNext();
        };

        const handlePlaying = () => {
            setIsLoading(false);
            setIsPlaying(true);
        };

        const handleWaiting = () => {
            setIsLoading(true);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('waiting', handleWaiting);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('waiting', handleWaiting);
        };
    }, []);

    useEffect(() => {
        if (streamUrl) {
            audioRef.current.src = streamUrl;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback error", e));
            }
        }
    }, [streamUrl]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Set true stream URL when track changes
    useEffect(() => {
        const fetchStreamUrl = () => {
            if (!currentTrack) return;
            setIsLoading(true);
            try {
                // Get absolute base URL from API instance
                let backendUrl = api.defaults.baseURL || 'http://localhost:5000';
                
                // Construct the direct streaming URL via our backend proxy
                const directStreamUrl = `${backendUrl}/api/ytm/stream/${currentTrack.id}`;
                
                setStreamUrl(directStreamUrl);
                
                // Playback handling is managed by the streamUrl effect defined above
            } catch (error) {
                console.error("Failed to set stream target", error);
                setIsLoading(false);
            }
        };

        fetchStreamUrl();
    }, [currentTrack]);


    const togglePlay = () => {
        if (!currentTrack) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Playback error", e));
            setIsPlaying(true);
        }
    };

    const playTrack = (track, newQueue = null) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }

        setCurrentTrack(track);
        setIsPlaying(true);
        if (newQueue) {
            setQueue(newQueue);
        }
    };

    const handleNext = () => {
        if (queue.length === 0 || !currentTrack) return;
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        if (currentIndex < queue.length - 1) {
            playTrack(queue[currentIndex + 1]);
        } else {
            setIsPlaying(false);
            audioRef.current.pause();
        }
    };

    const handlePrev = () => {
        if (queue.length === 0 || !currentTrack) return;
        if (audioRef.current.currentTime > 3) {
            // restart track
            audioRef.current.currentTime = 0;
            return;
        }

        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        if (currentIndex > 0) {
            playTrack(queue[currentIndex - 1]);
        }
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setProgress(time);
    };

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                queue,
                progress,
                duration,
                volume,
                isLoading,
                setVolume,
                togglePlay,
                playTrack,
                handleNext,
                handlePrev,
                seek,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

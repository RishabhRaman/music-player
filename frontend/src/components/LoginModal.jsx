import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import './LoginModal.css';

const LoginModal = () => {
    const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isLoginModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        setIsLoading(true);
        setError('');

        const result = await login(username.trim());

        if (!result.success) {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="modal-overlay">
            <div className="login-modal glass-panel">
                <button className="close-btn" onClick={() => setIsLoginModalOpen(false)}>
                    <X size={24} />
                </button>

                <h2>Login to Orbit Music</h2>
                <p className="modal-subtitle">Pick a username to save your liked songs and playlists.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. musiclover99"
                            autoComplete="off"
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={isLoading || !username.trim()}
                    >
                        {isLoading ? <div className="spinner-small" /> : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;

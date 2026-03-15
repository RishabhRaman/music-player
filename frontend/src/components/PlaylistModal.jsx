import React, { useState } from 'react';
import { X } from 'lucide-react';
import './PlaylistModal.css';

const PlaylistModal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <div className="playlist-modal-overlay glass-panel" onClick={onClose}>
            <div className="playlist-modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2>Create new playlist</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="My awesome playlist"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={!name.trim()}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaylistModal;

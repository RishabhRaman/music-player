import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    tracks: [{
        videoId: String,
        title: String,
        artist: String,
        thumbnail: String,
        duration: String
    }]
}, { timestamps: true });

export default mongoose.model('Playlist', playlistSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    likedSongs: [{
        videoId: String,
        title: String,
        artist: String,
        thumbnail: String,
        duration: String
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);

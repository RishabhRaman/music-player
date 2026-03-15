import youtubedl from 'youtube-dl-exec';

async function test() {
    try {
        const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Astley
        
        console.log('Fetching info with yt-dlp...');
        const info = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
        });
        
        // Find best audio-only stream
        const audioFormats = info.formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
        if (audioFormats && audioFormats.length > 0) {
            // Sort by bitrate or quality
            const bestAudio = audioFormats.sort((a, b) => b.abr - a.abr)[0];
            console.log('Stream found:', bestAudio ? 'Yes' : 'No');
            console.log('Stream URL:', bestAudio.url.substring(0, 150) + '...');
        } else {
            console.log('No audio streams found');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();

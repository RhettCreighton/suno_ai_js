/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

// PASTE THIS ENTIRE SCRIPT IN FIREFOX CONSOLE (F12)
// Works on suno.ai/suno.com

console.log('🎵 Starting Suno Downloader...');

// Find all audio elements on the page
var songs = [];
document.querySelectorAll('audio').forEach(function(audio) {
    if (audio.src && audio.src.includes('.mp3')) {
        songs.push(audio.src);
        console.log('Found:', audio.src);
    }
});

console.log('Total songs found:', songs.length);

if (songs.length === 0) {
    console.log('❌ No songs found!');
    console.log('Tips:');
    console.log('1. Make sure you are on your library or songs page');
    console.log('2. Scroll down to load more songs');
    console.log('3. Click play on some songs to load their MP3s');
    console.log('4. Run this script again');
    
    // Try to find play buttons
    var playButtons = document.querySelectorAll('button[aria-label*="Play"], button[aria-label*="play"]');
    console.log('Found', playButtons.length, 'play buttons on the page');
    
    if (playButtons.length > 0) {
        console.log('Try clicking some play buttons first!');
        // Highlight them
        playButtons.forEach(function(btn) {
            btn.style.border = '3px solid red';
        });
    }
} else {
    console.log('✅ Ready to download!');
    
    // Create download function
    window.downloadSunoSongs = function() {
        console.log('Opening songs in new tabs...');
        songs.forEach(function(url, index) {
            setTimeout(function() {
                window.open(url, '_blank');
                console.log('Opened song', index + 1, 'of', songs.length);
            }, index * 1000); // 1 second delay between each
        });
    };
    
    // Create a button
    var btn = document.createElement('button');
    btn.textContent = '📥 Download ' + songs.length + ' Songs';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:15px 30px;background:#ff6600;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;box-shadow:0 4px 6px rgba(0,0,0,0.3)';
    btn.onclick = window.downloadSunoSongs;
    document.body.appendChild(btn);
    
    console.log('Click the orange button to download all songs!');
    console.log('Or run: downloadSunoSongs()');
}
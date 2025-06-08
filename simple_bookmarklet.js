/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple Suno Downloader - Paste this directly in console to test

(function() {
    console.log('🎵 Suno Simple Downloader Starting...');
    
    let foundURLs = [];
    
    // Find all audio elements
    document.querySelectorAll('audio').forEach((audio, idx) => {
        if (audio.src && audio.src.includes('.mp3')) {
            foundURLs.push(audio.src);
            console.log(`Found song ${idx + 1}: ${audio.src}`);
        }
    });
    
    if (foundURLs.length === 0) {
        alert('No songs found! Try playing some songs first, then run this again.');
        return;
    }
    
    console.log(`📥 Downloading ${foundURLs.length} songs...`);
    
    // Download each with delay
    foundURLs.forEach((url, index) => {
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = url;
            link.download = 'suno_' + Date.now() + '_' + (index + 1) + '.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(`Downloaded ${index + 1}/${foundURLs.length}`);
        }, index * 1500);
    });
    
    alert(`Started downloading ${foundURLs.length} songs! Check your Downloads folder.`);
})();
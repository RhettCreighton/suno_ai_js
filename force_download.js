/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

// Force Download Script for Suno - Works around CORS restrictions

(async function() {
    console.log('🎵 Suno Force Downloader Starting...');
    
    // Create download helper
    async function forceDownload(url, filename) {
        try {
            // Method 1: Try direct download first
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return true;
        } catch (e) {
            console.log('Direct download failed, trying alternative...');
            
            // Method 2: Open in new tab
            window.open(url, '_blank');
            return true;
        }
    }
    
    // Find all MP3 URLs
    const mp3URLs = new Set();
    
    // Check audio elements
    document.querySelectorAll('audio').forEach(audio => {
        if (audio.src && audio.src.includes('.mp3')) {
            mp3URLs.add(audio.src);
        }
    });
    
    // Check for CDN URLs in page
    const allText = document.body.innerHTML;
    const cdnPattern = /https:\/\/cdn[^"'\s]*\.mp3/g;
    const matches = allText.match(cdnPattern);
    if (matches) {
        matches.forEach(url => mp3URLs.add(url));
    }
    
    // Convert to array
    const urls = Array.from(mp3URLs);
    
    if (urls.length === 0) {
        // Try to find and click play buttons first
        console.log('No MP3s found. Looking for play buttons...');
        
        const playButtons = document.querySelectorAll('button[aria-label*="Play"], button[aria-label*="play"]');
        if (playButtons.length > 0) {
            alert(`Found ${playButtons.length} play buttons. Click them to load songs, then run this script again.`);
            
            // Highlight play buttons
            playButtons.forEach(btn => {
                btn.style.border = '3px solid red';
                btn.style.boxShadow = '0 0 10px red';
            });
        } else {
            alert('No songs found! Navigate to your library or created songs page.');
        }
        return;
    }
    
    // Create download panel
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a1a1a;
        border: 2px solid #ff6600;
        padding: 30px;
        border-radius: 10px;
        z-index: 999999;
        color: white;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        max-width: 400px;
    `;
    
    panel.innerHTML = `
        <h2 style="color: #ff6600; margin: 0 0 20px 0;">🎵 Suno Downloader</h2>
        <p>Found ${urls.length} songs ready to download.</p>
        <p style="font-size: 14px; color: #ccc;">Note: Due to browser restrictions, each song will open in a new tab. You may need to allow pop-ups.</p>
        <div style="margin: 20px 0;">
            <button id="download-all-btn" style="
                background: #ff6600;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
            ">📥 Download All (New Tabs)</button>
            
            <button id="copy-urls-btn" style="
                background: #0088ff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
            ">📋 Copy URLs to Clipboard</button>
            
            <button id="close-btn" style="
                background: #666;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            ">Close</button>
        </div>
        <div id="url-list" style="
            max-height: 200px;
            overflow-y: auto;
            background: #2a2a2a;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            margin-top: 10px;
            display: none;
        "></div>
    `;
    
    document.body.appendChild(panel);
    
    // Button handlers
    document.getElementById('download-all-btn').onclick = function() {
        alert(`Opening ${urls.length} songs in new tabs. Allow pop-ups if prompted!`);
        
        urls.forEach((url, idx) => {
            setTimeout(() => {
                window.open(url, '_blank');
                console.log(`Opened ${idx + 1}/${urls.length}`);
            }, idx * 1000);
        });
        
        setTimeout(() => {
            panel.remove();
        }, 2000);
    };
    
    document.getElementById('copy-urls-btn').onclick = function() {
        const urlText = urls.join('\n');
        navigator.clipboard.writeText(urlText).then(() => {
            alert('URLs copied to clipboard! You can paste them into a download manager.');
            
            // Show URLs
            const urlList = document.getElementById('url-list');
            urlList.style.display = 'block';
            urlList.textContent = urlText;
        });
    };
    
    document.getElementById('close-btn').onclick = function() {
        panel.remove();
    };
    
    console.log('Found URLs:', urls);
})();
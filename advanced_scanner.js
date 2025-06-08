/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

// Advanced Suno Scanner - Handles dynamic loading
// Paste this in Firefox console (F12)

(async function() {
    console.log('🎵 Advanced Suno Scanner Starting...');
    
    const foundURLs = new Set();
    let scanning = true;
    
    // Intercept all network requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('.mp3')) {
            foundURLs.add(url);
            console.log('Captured MP3:', url);
        }
        return originalFetch.apply(this, args);
    };
    
    // Intercept XHR
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        if (url && url.includes('.mp3')) {
            foundURLs.add(url);
            console.log('Captured MP3 (XHR):', url);
        }
        return originalXHR.apply(this, arguments);
    };
    
    // Create control panel
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1a1a1a;
        border: 2px solid #ff6600;
        padding: 20px;
        border-radius: 10px;
        z-index: 999999;
        color: white;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        min-width: 300px;
    `;
    
    function updatePanel() {
        panel.innerHTML = `
            <h3 style="color: #ff6600; margin: 0 0 15px 0;">🎵 Suno Scanner</h3>
            <div style="background: #2a2a2a; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                <div>Found: <strong>${foundURLs.size}</strong> songs</div>
                <div style="font-size: 12px; color: #888; margin-top: 5px;">
                    ${scanning ? '🔄 Scanning... scroll down to load more!' : '✅ Ready to download'}
                </div>
            </div>
            
            <button onclick="window.scrollBy(0, 1000)" style="
                background: #666;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
            ">⬇️ Scroll Down (Load More)</button>
            
            <button id="play-all-btn" style="
                background: #0088ff;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
            ">▶️ Auto-Play All Visible</button>
            
            <button id="download-btn" style="
                background: #ff6600;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
                font-weight: bold;
            ">📥 Download All Found</button>
            
            <button id="copy-btn" style="
                background: #00cc66;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            ">📋 Copy URLs</button>
        `;
        
        // Bind button handlers
        document.getElementById('play-all-btn').onclick = autoPlayAll;
        document.getElementById('download-btn').onclick = downloadAll;
        document.getElementById('copy-btn').onclick = copyURLs;
    }
    
    document.body.appendChild(panel);
    updatePanel();
    
    // Auto-play all visible songs
    async function autoPlayAll() {
        console.log('▶️ Auto-playing all visible songs...');
        scanning = true;
        updatePanel();
        
        const playButtons = document.querySelectorAll(
            'button[aria-label*="Play"], ' +
            'button[aria-label*="play"], ' +
            'div[role="button"][aria-label*="Play"], ' +
            'button:has(svg path[d*="M5v14l11"])'
        );
        
        console.log(`Found ${playButtons.length} play buttons`);
        
        for (let i = 0; i < playButtons.length; i++) {
            const btn = playButtons[i];
            if (btn.offsetParent !== null) { // Is visible
                console.log(`Playing song ${i + 1}/${playButtons.length}`);
                btn.click();
                
                // Wait for song to load
                await new Promise(r => setTimeout(r, 2000));
                
                // Stop the song
                btn.click();
                
                await new Promise(r => setTimeout(r, 500));
                updatePanel();
            }
        }
        
        scanning = false;
        updatePanel();
        console.log('✅ Finished auto-playing');
    }
    
    // Download all found songs
    function downloadAll() {
        const urls = Array.from(foundURLs);
        if (urls.length === 0) {
            alert('No songs found yet! Try:\n1. Scroll down to load more\n2. Click "Auto-Play All Visible"\n3. Play some songs manually');
            return;
        }
        
        if (confirm(`Open ${urls.length} songs in new tabs?\n\nNote: You\'ll need to save each one manually (Ctrl+S).`)) {
            urls.forEach((url, i) => {
                setTimeout(() => {
                    window.open(url, '_blank');
                    console.log(`Opened ${i + 1}/${urls.length}`);
                }, i * 1000);
            });
        }
    }
    
    // Copy URLs to clipboard
    function copyURLs() {
        const urls = Array.from(foundURLs);
        if (urls.length === 0) {
            alert('No songs found yet!');
            return;
        }
        
        const text = urls.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            alert(`Copied ${urls.length} URLs to clipboard!\n\nYou can paste them into a download manager.`);
        });
    }
    
    // Also scan existing audio elements
    function scanAudioElements() {
        document.querySelectorAll('audio').forEach(audio => {
            if (audio.src && audio.src.includes('.mp3')) {
                foundURLs.add(audio.src);
                updatePanel();
            }
        });
    }
    
    // Initial scan
    scanAudioElements();
    
    // Monitor for new audio elements
    const observer = new MutationObserver(() => {
        scanAudioElements();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Update panel periodically
    setInterval(updatePanel, 1000);
    
    console.log('✅ Scanner ready! Use the panel in the top-right corner.');
    console.log('Tips:');
    console.log('1. Scroll down to load more songs');
    console.log('2. Click "Auto-Play All Visible" to capture MP3 URLs');
    console.log('3. Click "Download All Found" when ready');
})();
/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

// Suno Downloader - Standalone Bookmarklet Version
// This is the full script embedded in the bookmarklet

javascript:(function(){
    if (window.sunoDownloaderActive) {
        window.runSunoDownload();
        return;
    }
    
    window.sunoDownloaderActive = true;
    window.capturedURLs = new Set();
    window.downloadedURLs = new Set();
    
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('.mp3')) {
            window.capturedURLs.add(url);
            console.log('🎵 Captured:', url);
        }
        return originalFetch.apply(this, args);
    };
    
    // Show progress
    function showProgress(msg, autoHide = 0) {
        let overlay = document.getElementById('suno-dl-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'suno-dl-overlay';
            overlay.style.cssText = 'position:fixed;top:20px;right:20px;background:#1a1a1a;color:white;padding:20px 30px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.3);z-index:999999;font-family:Arial,sans-serif;font-size:16px;border:2px solid #ff6600;';
            document.body.appendChild(overlay);
        }
        overlay.textContent = msg;
        overlay.style.display = 'block';
        if (autoHide > 0) setTimeout(() => overlay.style.display = 'none', autoHide);
    }
    
    // Main function
    window.runSunoDownload = async function() {
        showProgress('🔍 Scanning for songs...');
        
        // Scan audio elements
        document.querySelectorAll('audio').forEach(audio => {
            if (audio.src && audio.src.includes('.mp3')) {
                window.capturedURLs.add(audio.src);
            }
        });
        
        // Auto-play if no songs found
        if (window.capturedURLs.size === 0) {
            showProgress('▶️ Auto-playing songs...');
            
            const playBtns = [...document.querySelectorAll('button[aria-label*="Play"], button[aria-label*="play"], button:has(svg path[d*="M8 5v14l11-7z"])')];
            
            for (let i = 0; i < Math.min(playBtns.length, 15); i++) {
                if (playBtns[i].offsetParent !== null) {
                    playBtns[i].click();
                    await new Promise(r => setTimeout(r, 3000));
                    playBtns[i].click();
                    await new Promise(r => setTimeout(r, 500));
                }
            }
            
            // Scan again
            document.querySelectorAll('audio').forEach(audio => {
                if (audio.src && audio.src.includes('.mp3')) {
                    window.capturedURLs.add(audio.src);
                }
            });
        }
        
        // Download new URLs
        const newURLs = Array.from(window.capturedURLs).filter(url => !window.downloadedURLs.has(url));
        
        if (newURLs.length === 0) {
            showProgress('❌ No new songs found!', 3000);
            return;
        }
        
        showProgress(`📥 Downloading ${newURLs.length} songs...`);
        
        // Download with delay
        newURLs.forEach((url, idx) => {
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = url;
                a.download = `suno_${Date.now()}_${idx + 1}.mp3`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.downloadedURLs.add(url);
                
                const remaining = newURLs.length - idx - 1;
                if (remaining > 0) {
                    showProgress(`📥 Downloading... ${remaining} remaining`);
                } else {
                    showProgress(`✅ Downloaded ${newURLs.length} songs!`, 5000);
                }
            }, idx * 1500);
        });
    };
    
    // Run immediately
    window.runSunoDownload();
})();
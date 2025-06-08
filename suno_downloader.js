/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

// Suno MP3 Downloader - Main Script
// This is loaded dynamically by the bookmarklet

(function() {
    // Prevent duplicate initialization
    if (window.sunoDownloaderV2Active) {
        console.log('🎵 Suno Downloader already active, running download...');
        window.sunoDownloaderV2.run();
        return;
    }

    console.log('🎵 Suno Downloader v2.0 Initializing...');
    
    window.sunoDownloaderV2Active = true;
    window.sunoDownloaderV2 = {
        capturedURLs: new Set(),
        downloadedURLs: new Set(),
        
        // Initialize interceptors
        init: function() {
            // Intercept fetch requests
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const url = args[0];
                if (typeof url === 'string' && url.includes('.mp3')) {
                    window.sunoDownloaderV2.capturedURLs.add(url);
                    console.log('🎵 Captured MP3:', url);
                }
                return originalFetch.apply(this, args);
            };
            
            // Intercept XMLHttpRequest
            const originalXHR = window.XMLHttpRequest.prototype.open;
            window.XMLHttpRequest.prototype.open = function(method, url) {
                if (url && url.includes('.mp3')) {
                    window.sunoDownloaderV2.capturedURLs.add(url);
                    console.log('🎵 Captured MP3 (XHR):', url);
                }
                return originalXHR.apply(this, arguments);
            };
        },
        
        // Scan for existing audio elements
        scanAudioElements: function() {
            const audioElements = document.querySelectorAll('audio, video');
            audioElements.forEach(element => {
                if (element.src && element.src.includes('.mp3')) {
                    this.capturedURLs.add(element.src);
                    console.log('🎵 Found audio element:', element.src);
                }
            });
        },
        
        // Auto-play songs to capture URLs
        autoPlaySongs: async function() {
            console.log('▶️ Auto-playing songs to capture MP3 URLs...');
            
            // Multiple selectors for different Suno UI versions
            const playButtonSelectors = [
                'button[aria-label*="Play"]',
                'button[aria-label*="play"]',
                'button[data-testid*="play"]',
                'div[role="button"][aria-label*="Play"]',
                'button:has(svg path[d*="M8 5v14l11-7z"])',
                '[class*="play-button"]',
                '[class*="PlayButton"]'
            ];
            
            let playButtons = [];
            for (const selector of playButtonSelectors) {
                const found = document.querySelectorAll(selector);
                playButtons = [...playButtons, ...found];
            }
            
            // Remove duplicates and non-visible elements
            playButtons = [...new Set(playButtons)].filter(btn => btn.offsetParent !== null);
            
            console.log(`Found ${playButtons.length} play buttons`);
            
            // Play up to 20 songs
            const maxSongs = Math.min(playButtons.length, 20);
            for (let i = 0; i < maxSongs; i++) {
                const btn = playButtons[i].tagName === 'BUTTON' ? playButtons[i] : playButtons[i].closest('button');
                
                if (btn) {
                    console.log(`Playing song ${i + 1}/${maxSongs}`);
                    
                    // Click to play
                    btn.click();
                    
                    // Wait for MP3 to load
                    await new Promise(r => setTimeout(r, 3000));
                    
                    // Click again to pause (optional)
                    btn.click();
                    
                    // Short pause before next
                    await new Promise(r => setTimeout(r, 500));
                }
            }
            
            console.log('✅ Finished auto-playing songs');
        },
        
        // Download a single MP3
        downloadMP3: function(url, index) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `suno_${timestamp}_${index + 1}.mp3`;
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            this.downloadedURLs.add(url);
            console.log(`📥 Downloaded: ${filename}`);
        },
        
        // Main run function
        run: async function() {
            console.log('🚀 Starting Suno download process...');
            
            // Show progress overlay
            this.showProgress('Scanning for songs...');
            
            // Scan existing elements
            this.scanAudioElements();
            
            // If no songs found, try auto-playing
            if (this.capturedURLs.size === 0) {
                this.showProgress('Auto-playing songs to find MP3s...');
                await this.autoPlaySongs();
                
                // Scan again after playing
                this.scanAudioElements();
            }
            
            // Filter out already downloaded URLs
            const newURLs = Array.from(this.capturedURLs).filter(url => !this.downloadedURLs.has(url));
            
            if (newURLs.length === 0) {
                this.showProgress('No new songs found!', 3000);
                return;
            }
            
            // Download all new URLs
            this.showProgress(`Downloading ${newURLs.length} songs...`);
            
            newURLs.forEach((url, index) => {
                setTimeout(() => {
                    this.downloadMP3(url, index);
                    
                    // Update progress
                    const remaining = newURLs.length - index - 1;
                    if (remaining > 0) {
                        this.showProgress(`Downloading... ${remaining} remaining`);
                    } else {
                        this.showProgress(`✅ Downloaded ${newURLs.length} songs!`, 5000);
                    }
                }, index * 1500);
            });
        },
        
        // Show progress overlay
        showProgress: function(message, autoHide = 0) {
            let overlay = document.getElementById('suno-downloader-overlay');
            
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'suno-downloader-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #1a1a1a;
                    color: white;
                    padding: 20px 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    border: 2px solid #ff6600;
                `;
                document.body.appendChild(overlay);
            }
            
            overlay.textContent = message;
            overlay.style.display = 'block';
            
            if (autoHide > 0) {
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, autoHide);
            }
        }
    };
    
    // Initialize and run
    window.sunoDownloaderV2.init();
    window.sunoDownloaderV2.run();
})();
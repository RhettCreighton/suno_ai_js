/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

(function() {
    console.log('🎵 Suno MP3 Downloader Starting...');
    
    // Store download links
    window.sunoDownloads = window.sunoDownloads || [];
    
    // Function to extract download links from the current page
    function extractDownloadLinks() {
        const downloads = [];
        
        // Try multiple possible selectors for download buttons/links
        const selectors = [
            'a[href*=".mp3"]',
            'a[href*="cdn"][href*="suno"]',
            'a[download]',
            'button[aria-label*="download"]',
            'button[title*="download"]',
            '[data-testid="download-button"]',
            'a[href*="audio_"]',
            'a[href*="/api/download"]'
        ];
        
        let foundLinks = [];
        
        // Try each selector
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    const href = el.href || el.getAttribute('data-href');
                    if (href && href.includes('mp3')) {
                        foundLinks.push({
                            url: href,
                            title: el.closest('[data-testid="song-card"]')?.querySelector('h3')?.textContent || 'Unknown Song'
                        });
                    }
                });
            }
        }
        
        return foundLinks;
    }
    
    // Function to monitor network requests for mp3 URLs
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then(response => {
                const url = args[0];
                
                // Check if this is an mp3 URL
                if (url.includes('.mp3') || url.includes('audio_')) {
                    console.log('🎵 Found MP3 URL:', url);
                    window.sunoDownloads.push({
                        url: url,
                        title: 'Audio File'
                    });
                }
                
                // Clone response to check for download links in API responses
                const clonedResponse = response.clone();
                if (url.includes('api')) {
                    clonedResponse.json().then(data => {
                        // Look for audio URLs in the response
                        const findUrls = (obj) => {
                            if (typeof obj !== 'object' || !obj) return;
                            
                            for (const key in obj) {
                                if (typeof obj[key] === 'string' && 
                                    (obj[key].includes('.mp3') || obj[key].includes('audio_'))) {
                                    const songTitle = obj.title || obj.name || 'Unknown';
                                    window.sunoDownloads.push({
                                        url: obj[key],
                                        title: songTitle
                                    });
                                    console.log('🎵 Found MP3 in API:', songTitle, obj[key]);
                                } else if (typeof obj[key] === 'object') {
                                    findUrls(obj[key]);
                                }
                            }
                        };
                        
                        findUrls(data);
                    }).catch(() => {});
                }
                
                return response;
            });
        };
    }
    
    // Function to trigger download
    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/[^a-z0-9\s\-\_\.]/gi, '') + '.mp3';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    // Function to download all collected URLs
    function downloadAll() {
        const uniqueDownloads = Array.from(new Map(
            window.sunoDownloads.map(item => [item.url, item])
        ).values());
        
        console.log(`📥 Downloading ${uniqueDownloads.length} MP3s...`);
        
        uniqueDownloads.forEach((item, index) => {
            setTimeout(() => {
                console.log(`Downloading ${index + 1}/${uniqueDownloads.length}: ${item.title}`);
                downloadFile(item.url, item.title);
            }, index * 2000); // 2 second delay between downloads
        });
    }
    
    // Function to scan for song cards and extract data
    function scanSongCards() {
        const cards = document.querySelectorAll('[data-testid="song-card"], div[class*="song-item"], a[href^="/song/"]');
        const downloads = [];
        
        cards.forEach(card => {
            // Try to find play button or audio element
            const playButton = card.querySelector('button[aria-label*="play"], button[title*="play"]');
            const audioElement = card.querySelector('audio');
            const songLink = card.querySelector('a[href^="/song/"]');
            const titleElement = card.querySelector('h3, [class*="title"], span[class*="name"]');
            
            if (songLink || playButton || audioElement) {
                const songId = songLink?.href?.match(/\/song\/([^\/]+)/)?.[1];
                const title = titleElement?.textContent || 'Unknown Song';
                
                if (songId) {
                    // Construct potential download URL based on Suno's patterns
                    const possibleUrls = [
                        `https://cdn1.suno.ai/audio_${songId}.mp3`,
                        `https://cdn.suno.ai/audio_${songId}.mp3`,
                        `https://cdn-o.suno.com/audio_${songId}.mp3`
                    ];
                    
                    possibleUrls.forEach(url => {
                        downloads.push({
                            url: url,
                            title: title,
                            songId: songId
                        });
                    });
                }
            }
        });
        
        return downloads;
    }
    
    // Start monitoring
    interceptFetch();
    
    // Scan current page
    const pageLinks = extractDownloadLinks();
    const cardLinks = scanSongCards();
    
    window.sunoDownloads = [...window.sunoDownloads, ...pageLinks, ...cardLinks];
    
    // Create control panel
    const panel = document.createElement('div');
    panel.id = 'suno-downloader-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        max-height: 600px;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        z-index: 10000;
        font-family: monospace;
        font-size: 12px;
    `;
    
    const updatePanel = () => {
        const uniqueDownloads = Array.from(new Map(
            window.sunoDownloads.map(item => [item.url, item])
        ).values());
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #4CAF50;">📥 Suno MP3 Downloader</h3>
            <p style="margin: 5px 0;">Found ${uniqueDownloads.length} potential downloads</p>
            <button id="scan-page" style="
                background: #2196F3;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 10px;
                width: 100%;
            ">Scan Page for Songs</button>
            <button id="download-all" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 10px;
                width: 100%;
            ">Download All MP3s</button>
            <button id="close-panel" style="
                background: #f44336;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 10px;
                width: 100%;
            ">Close Panel</button>
            <div style="max-height: 300px; overflow-y: auto; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px;">
                <h4 style="margin: 0 0 10px 0;">Found Songs:</h4>
                ${uniqueDownloads.map((item, i) => 
                    `<div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.05); border-radius: 3px;">
                        ${i + 1}. ${item.title}
                    </div>`
                ).join('')}
            </div>
        `;
        
        // Add event listeners
        document.getElementById('scan-page')?.addEventListener('click', () => {
            console.log('🔍 Scanning page for songs...');
            const newLinks = scanSongCards();
            window.sunoDownloads = [...window.sunoDownloads, ...newLinks];
            updatePanel();
            
            // Also trigger play buttons to potentially load audio URLs
            const playButtons = document.querySelectorAll('button[aria-label*="play"]');
            console.log(`Found ${playButtons.length} play buttons to check`);
        });
        
        document.getElementById('download-all')?.addEventListener('click', () => {
            downloadAll();
        });
        
        document.getElementById('close-panel')?.addEventListener('click', () => {
            panel.remove();
        });
    };
    
    // Remove existing panel if any
    const existingPanel = document.getElementById('suno-downloader-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    document.body.appendChild(panel);
    updatePanel();
    
    // Auto-scan periodically
    setInterval(() => {
        const before = window.sunoDownloads.length;
        const newLinks = scanSongCards();
        window.sunoDownloads = [...window.sunoDownloads, ...newLinks];
        
        if (window.sunoDownloads.length > before) {
            console.log(`🆕 Found ${window.sunoDownloads.length - before} new potential downloads!`);
            updatePanel();
        }
    }, 3000);
    
    console.log('✅ Suno MP3 Downloader Active!');
    console.log('💡 Tips:');
    console.log('- Click "Scan Page" to find all songs on current page');
    console.log('- Click "Download All" to download found MP3s');
    console.log('- Check console for detailed logs');
    console.log('- Some songs may need you to play them first to load URLs');
})();
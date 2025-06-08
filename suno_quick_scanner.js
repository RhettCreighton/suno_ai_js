/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

(function() {
    console.log('🎵 Suno Song Scanner Starting...');
    
    // Function to extract songs from the current page
    function extractSongs() {
        const songs = [];
        
        // Try multiple possible selectors for song titles
        const selectors = [
            '[data-testid="song-title"]',
            '.song-title',
            'h3[class*="title"]',
            'div[class*="song"] h3',
            'a[href^="/song/"] span',
            'div[class*="card"] span[class*="title"]',
            '[class*="track-name"]',
            '[class*="song-name"]'
        ];
        
        let foundElements = [];
        
        // Try each selector until we find songs
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                foundElements = elements;
                console.log(`Found ${elements.length} songs using selector: ${selector}`);
                break;
            }
        }
        
        // If no specific selectors work, try a more general approach
        if (foundElements.length === 0) {
            // Look for links that go to /song/
            const songLinks = document.querySelectorAll('a[href*="/song/"]');
            songLinks.forEach(link => {
                const titleElement = link.querySelector('span, div, h3, p');
                if (titleElement && titleElement.textContent.trim()) {
                    foundElements.push(titleElement);
                }
            });
        }
        
        // Extract text from found elements
        foundElements.forEach(el => {
            const title = el.textContent.trim();
            if (title && !songs.includes(title)) {
                songs.push(title);
            }
        });
        
        return songs;
    }
    
    // Function to monitor API calls for song data
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then(response => {
                const clonedResponse = response.clone();
                
                // Check if this is a Suno API call
                if (args[0].includes('api') || args[0].includes('suno')) {
                    clonedResponse.json().then(data => {
                        // Look for song data in the response
                        if (data.songs || data.tracks || data.items) {
                            const songs = data.songs || data.tracks || data.items;
                            const titles = songs.map(song => song.title || song.name).filter(Boolean);
                            if (titles.length > 0) {
                                console.log('🎵 Songs from API:', titles);
                                window.sunoSongs = [...new Set([...(window.sunoSongs || []), ...titles])];
                            }
                        }
                    }).catch(() => {});
                }
                
                return response;
            });
        };
    }
    
    // Main execution
    interceptFetch();
    
    // Extract songs from current page
    const pageSongs = extractSongs();
    
    // Initialize or update global song list
    window.sunoSongs = [...new Set([...(window.sunoSongs || []), ...pageSongs])];
    
    // Display results
    console.log('📋 All Songs Found:');
    console.log('==================');
    window.sunoSongs.forEach((song, index) => {
        console.log(`${index + 1}. ${song}`);
    });
    console.log('==================');
    console.log(`Total: ${window.sunoSongs.length} songs`);
    
    // Create a floating panel to show results
    const panel = document.createElement('div');
    panel.id = 'suno-scanner-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        max-height: 500px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        z-index: 10000;
        font-family: monospace;
        font-size: 12px;
    `;
    
    panel.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #4CAF50;">🎵 Suno Songs (${window.sunoSongs.length})</h3>
        <button id="copy-songs" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
            width: 100%;
        ">Copy All Songs</button>
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
        <div id="song-list" style="white-space: pre-wrap;">
${window.sunoSongs.map((song, i) => `${i + 1}. ${song}`).join('\n')}
        </div>
    `;
    
    // Remove existing panel if any
    const existingPanel = document.getElementById('suno-scanner-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    document.body.appendChild(panel);
    
    // Add click handlers
    document.getElementById('copy-songs').addEventListener('click', () => {
        const songText = window.sunoSongs.join('\n');
        navigator.clipboard.writeText(songText).then(() => {
            console.log('✅ Songs copied to clipboard!');
            document.getElementById('copy-songs').textContent = 'Copied!';
            setTimeout(() => {
                document.getElementById('copy-songs').textContent = 'Copy All Songs';
            }, 2000);
        });
    });
    
    document.getElementById('close-panel').addEventListener('click', () => {
        panel.remove();
    });
    
    // Auto-update panel when new songs are found
    setInterval(() => {
        const newSongs = extractSongs();
        const before = window.sunoSongs.length;
        window.sunoSongs = [...new Set([...window.sunoSongs, ...newSongs])];
        
        if (window.sunoSongs.length > before) {
            console.log(`🆕 Found ${window.sunoSongs.length - before} new songs!`);
            const songList = document.getElementById('song-list');
            if (songList) {
                songList.textContent = window.sunoSongs.map((song, i) => `${i + 1}. ${song}`).join('\n');
                document.querySelector('#suno-scanner-panel h3').textContent = `🎵 Suno Songs (${window.sunoSongs.length})`;
            }
        }
    }, 2000);
    
    console.log('✅ Suno Scanner Active! Songs will be captured as you browse.');
    console.log('💡 Tip: Access all songs anytime with: console.log(window.sunoSongs)');
})();
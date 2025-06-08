/* SPDX-FileCopyrightText: 2025 Rhett Creighton
 * SPDX-License-Identifier: Apache-2.0
 */

// Suno Downloader - Hot Updatable Version
// This loads the latest version from GitHub

(async function() {
    console.log('🎵 Loading Suno Downloader from GitHub...');
    
    try {
        // Load the latest version from GitHub
        const response = await fetch('https://raw.githubusercontent.com/RhettCreighton/suno_ai_js/main/suno_downloader.js');
        const script = await response.text();
        
        // Execute the loaded script
        const scriptElement = document.createElement('script');
        scriptElement.textContent = script;
        document.head.appendChild(scriptElement);
        
        console.log('✅ Suno Downloader loaded successfully!');
    } catch (error) {
        console.error('Failed to load Suno Downloader:', error);
        alert('Failed to load Suno Downloader. Check console for details.');
    }
})();
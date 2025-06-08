# Suno AI Downloader

A powerful bookmarklet for downloading MP3s from Suno AI.

## 🚀 Quick Install

**Copy this ENTIRE code block and create a bookmark with it:**

```javascript
javascript:(function(){if(window.sunoDownloaderActive){window.runSunoDownload();return}window.sunoDownloaderActive=!0;window.capturedURLs=new Set();window.downloadedURLs=new Set();const a=window.fetch;window.fetch=function(...b){const c=b[0];'string'==typeof c&&c.includes('.mp3')&&window.capturedURLs.add(c);return a.apply(this,b)};function showProgress(b,c=0){let a=document.getElementById('suno-dl-overlay');a||(a=document.createElement('div'),a.id='suno-dl-overlay',a.style.cssText='position:fixed;top:20px;right:20px;background:#1a1a1a;color:white;padding:20px 30px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.3);z-index:999999;font-family:Arial,sans-serif;font-size:16px;border:2px solid #ff6600;',document.body.appendChild(a));a.textContent=b;a.style.display='block';0<c&&setTimeout(()=>a.style.display='none',c)}window.runSunoDownload=async function(){showProgress('🔍 Scanning for songs...');document.querySelectorAll('audio').forEach(a=>{a.src&&a.src.includes('.mp3')&&window.capturedURLs.add(a.src)});if(0===window.capturedURLs.size){showProgress('▶️ Auto-playing songs...');const a=[...document.querySelectorAll('button[aria-label*="Play"],button[aria-label*="play"],button:has(svg path[d*="M8 5v14l11-7z"])')];for(let b=0;b<Math.min(a.length,15);b++)null!==a[b].offsetParent&&(a[b].click(),await new Promise(c=>setTimeout(c,3E3)),a[b].click(),await new Promise(c=>setTimeout(c,500)));document.querySelectorAll('audio').forEach(a=>{a.src&&a.src.includes('.mp3')&&window.capturedURLs.add(a.src)})}const a=Array.from(window.capturedURLs).filter(a=>!window.downloadedURLs.has(a));0===a.length?showProgress('❌ No new songs found!',3E3):(showProgress(`📥 Downloading ${a.length} songs...`),a.forEach((b,c)=>{setTimeout(()=>{const d=document.createElement('a');d.href=b;d.download=`suno_${Date.now()}_${c+1}.mp3`;document.body.appendChild(d);d.click();document.body.removeChild(d);window.downloadedURLs.add(b);const e=a.length-c-1;0<e?showProgress(`📥 Downloading... ${e} remaining`):showProgress(`✅ Downloaded ${a.length} songs!`,5E3)},1500*c)}))};window.runSunoDownload()})();
```

### How to create the bookmark:
1. Copy the code above
2. Right-click your bookmarks toolbar (Ctrl+Shift+B to show it)
3. Select "Add Bookmark..."
4. Name: `🎵 Suno Download`
5. URL: Paste the code
6. Save

## 📥 How to Use

1. Go to suno.ai or suno.com
2. Navigate to your songs/library
3. Click the `🎵 Suno Download` bookmark
4. The downloader will:
   - Scan for existing MP3s on the page
   - Auto-play up to 20 songs to capture their URLs
   - Download all found MP3s with timestamps
   - Show progress in the top-right corner

## ✨ Features

- **Hot Updates**: Always loads the latest version from GitHub
- **Smart Detection**: Finds MP3s using multiple methods
- **Auto-Play**: Automatically plays songs to load their MP3 URLs
- **Progress Tracking**: Shows download progress
- **Duplicate Prevention**: Won't re-download the same songs
- **Timestamped Names**: Files named with timestamps to avoid conflicts

## 🔧 Advanced Usage

The downloader exposes a global object for manual control:

```javascript
// Run the downloader again
window.sunoDownloaderV2.run()

// Check captured URLs
window.sunoDownloaderV2.capturedURLs

// Manually scan audio elements
window.sunoDownloaderV2.scanAudioElements()
```

## 📝 Notes

- Downloads go to your browser's default Downloads folder
- Works best when songs are visible on the page
- May need to scroll to load more songs
- Each download has a 1.5 second delay to prevent overwhelming the browser

## 🐛 Troubleshooting

- **No songs found**: Make sure you're on a page with songs (library, create page, etc.)
- **Downloads not starting**: Check your browser's download settings
- **Some songs missing**: Try manually playing them first

## 📚 Files in this repo

- `suno_downloader.js` - Main downloader script (hot-loaded by bookmarklet)
- `bookmarklet_loader.txt` - The bookmarklet code to copy
- `suno_mp3_downloader.js` - Legacy standalone version
- `suno_quick_scanner.js` - Simple scanner tool for listing songs

## 🔄 Note About External Scripts

Due to browser security policies, loading scripts from GitHub raw URLs is blocked. The bookmarklet above contains the entire script embedded, so it works immediately without external dependencies.

## License

Apache-2.0
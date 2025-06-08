# Suno AI Downloader

A powerful bookmarklet for downloading MP3s from Suno AI.

## 🚀 Quick Install

**Copy this ENTIRE line and create a bookmark with it:**

```
javascript:(function(){if(window.sunoDownloaderActive){window.runSunoDownload();return}window.sunoDownloaderActive=true;window.capturedURLs=new Set();window.downloadedURLs=new Set();const originalFetch=window.fetch;window.fetch=function(...args){const url=args[0];if(typeof url==='string'&&url.includes('.mp3')){window.capturedURLs.add(url);console.log('Captured:',url)}return originalFetch.apply(this,args)};function showProgress(msg,autoHide=0){let overlay=document.getElementById('suno-dl-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='suno-dl-overlay';overlay.style.cssText='position:fixed;top:20px;right:20px;background:#1a1a1a;color:white;padding:20px 30px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.3);z-index:999999;font-family:Arial,sans-serif;font-size:16px;border:2px solid #ff6600;';document.body.appendChild(overlay)}overlay.textContent=msg;overlay.style.display='block';if(autoHide>0){setTimeout(()=>overlay.style.display='none',autoHide)}}window.runSunoDownload=async function(){showProgress('🔍 Scanning for songs...');document.querySelectorAll('audio').forEach(audio=>{if(audio.src&&audio.src.includes('.mp3')){window.capturedURLs.add(audio.src)}});if(window.capturedURLs.size===0){showProgress('▶️ Auto-playing songs...');const playBtns=[...document.querySelectorAll('button[aria-label*="Play"],button[aria-label*="play"]')];for(let i=0;i<Math.min(playBtns.length,15);i++){if(playBtns[i]&&playBtns[i].offsetParent!==null){playBtns[i].click();await new Promise(r=>setTimeout(r,3000));playBtns[i].click();await new Promise(r=>setTimeout(r,500))}}document.querySelectorAll('audio').forEach(audio=>{if(audio.src&&audio.src.includes('.mp3')){window.capturedURLs.add(audio.src)}})}const newURLs=Array.from(window.capturedURLs).filter(url=>!window.downloadedURLs.has(url));if(newURLs.length===0){showProgress('❌ No new songs found!',3000);return}showProgress(`📥 Downloading ${newURLs.length} songs...`);newURLs.forEach((url,idx)=>{setTimeout(()=>{const a=document.createElement('a');a.href=url;a.download=`suno_${Date.now()}_${idx+1}.mp3`;document.body.appendChild(a);a.click();document.body.removeChild(a);window.downloadedURLs.add(url);const remaining=newURLs.length-idx-1;if(remaining>0){showProgress(`📥 Downloading... ${remaining} remaining`)}else{showProgress(`✅ Downloaded ${newURLs.length} songs!`,5000)}},idx*1500)})};window.runSunoDownload()})();
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
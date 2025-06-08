# Suno AI Downloader - Hot Updatable

A powerful bookmarklet for downloading MP3s from Suno AI that always loads the latest version from GitHub.

## 🚀 Quick Install

**Copy this code and create a bookmark with it:**

```javascript
javascript:(async()=>{try{const r=await fetch('https://raw.githubusercontent.com/RhettCreighton/suno_ai_js/main/suno_downloader.js'),s=await r.text(),e=document.createElement('script');e.textContent=s;document.head.appendChild(e)}catch(e){alert('Failed to load Suno Downloader: '+e.message)}})();
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

## 🔄 Updating

The beauty of this system is that you never need to update your bookmark! When I push updates to `suno_downloader.js`, your bookmark will automatically load the latest version.

## License

Apache-2.0
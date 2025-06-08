# Suno AI Downloader

A powerful bookmarklet for downloading MP3s from Suno AI.

## 🚀 Quick Install

**Simple Working Bookmarklet:**

```
javascript:(function(){var s=[];document.querySelectorAll('audio').forEach(function(a){if(a.src&&a.src.includes('.mp3')){s.push(a.src)}});if(s.length==0){alert('No songs found! Try playing some songs first.');return}if(confirm('Found '+s.length+' songs. Download?')){s.forEach(function(u,i){setTimeout(function(){window.open(u)},i*1000)})}})();
```

## 📋 Easy Console Method (Recommended)

1. Go to suno.com/me (your library)
2. Open Firefox Console (F12)
3. Copy and paste the ENTIRE contents of `paste_in_console.js` from this repo
4. An orange download button will appear if songs are found

The console script:
- Shows exactly how many songs are found
- Creates a download button
- Provides helpful tips if no songs are found

### 🎯 Best Method: Advanced Scanner (Console)

For finding ALL your songs, paste this in Firefox console (F12):

```javascript
fetch('https://raw.githubusercontent.com/RhettCreighton/suno_ai_js/main/advanced_scanner.js').then(r=>r.text()).then(eval).catch(()=>alert('Load the script manually from the repo'));
```

This loads an advanced scanner with:
- Real-time song detection
- Auto-play feature to load MP3 URLs
- Download manager
- Progress tracking

### Manual Console Script

If the above doesn't work, copy the contents of `advanced_scanner.js` from this repo and paste directly in console.

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
# Suno AI Downloader

A powerful bookmarklet for downloading MP3s from Suno AI.

## 🚀 Quick Install

**Copy this ENTIRE line and create a bookmark with it:**

```
javascript:(function(){const u=new Set();document.querySelectorAll('audio').forEach(a=>{a.src&&a.src.includes('.mp3')&&u.add(a.src)});const m=document.body.innerHTML.match(/https:\/\/cdn[^"'\s]*\.mp3/g);m&&m.forEach(url=>u.add(url));const a=Array.from(u);if(!a.length){alert('No songs found! Play some songs first.');return}if(confirm(`Found ${a.length} songs. Open all in new tabs?`)){a.forEach((url,i)=>{setTimeout(()=>window.open(url,'_blank'),i*1000)})}})();
```

### Alternative: Advanced Downloader (Paste in Console)

If the bookmarklet doesn't work due to CORS restrictions, paste this in the Firefox console (F12):

```javascript
(async function() {
    console.log('🎵 Suno Downloader Starting...');
    const urls = new Set();
    
    // Find all MP3 URLs
    document.querySelectorAll('audio').forEach(a => {
        if (a.src && a.src.includes('.mp3')) urls.add(a.src);
    });
    
    // Find CDN URLs in page
    const matches = document.body.innerHTML.match(/https:\/\/cdn[^"'\s]*\.mp3/g);
    if (matches) matches.forEach(url => urls.add(url));
    
    const mp3s = Array.from(urls);
    if (!mp3s.length) {
        alert('No songs found! Play some songs first.');
        return;
    }
    
    console.log(`Found ${mp3s.length} songs:`, mp3s);
    
    // Download each MP3
    for (let i = 0; i < mp3s.length; i++) {
        console.log(`Opening song ${i+1}/${mp3s.length}`);
        window.open(mp3s[i], '_blank');
        await new Promise(r => setTimeout(r, 1000));
    }
})();
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
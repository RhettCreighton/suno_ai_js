# Suno AI Song Scanner

A bookmarklet to extract and copy all your song names from Suno.com

## Quick Start

### 1. Create the Bookmarklet

Copy this entire line and save it as a bookmark:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://raw.githubusercontent.com/RhettCreighton/suno_ai_js/main/suno_quick_scanner.js';document.head.appendChild(s);})();
```

### 2. How to Add the Bookmarklet

1. Copy the javascript code above
2. Right-click your bookmarks bar
3. Select "Add Bookmark" 
4. Name it: "Suno Scanner"
5. URL: Paste the javascript code
6. Save the bookmark

### 3. Use It

1. Go to https://suno.com/me
2. Click the "Suno Scanner" bookmark
3. A panel will appear with all your songs
4. Click "Copy All Songs" to copy to clipboard

## Features

- 🎵 Automatically extracts all song names
- 📊 Shows live count in floating panel
- 🔄 Updates as you browse
- 📋 One-click copy to clipboard
- 🖥️ Console logging for debugging

## Manual Testing

Paste this in the console on suno.com:

```javascript
var s=document.createElement('script');
s.src='https://raw.githubusercontent.com/RhettCreighton/suno_ai_js/main/suno_quick_scanner.js';
document.head.appendChild(s);
```

## License

Apache-2.0
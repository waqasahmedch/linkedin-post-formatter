# LinkedIn Post Formatter

A lightweight, 100% client-side web app that lets you format LinkedIn posts with **bold**, *italic*, underline, strikethrough, bullets, numbered lists, emojis, and line spacers — then copy the result straight into LinkedIn.

LinkedIn doesn't support rich text, so this tool uses **Unicode math characters** and **combining marks** that render as formatted text on LinkedIn (and everywhere else).

## Features

- ✅ Bold, Italic, Bold-Italic, Underline, Strikethrough
- ✅ Bulleted and numbered lists
- ✅ Emoji picker (categorized)
- ✅ Line spacer (stops LinkedIn from collapsing blank lines)
- ✅ Character counter (LinkedIn's 3000-char limit)
- ✅ Keyboard shortcuts (Ctrl/Cmd + B / I / U)
- ✅ Copy to clipboard with one click
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Works offline — no backend, no tracking

## Run locally

### Method 1 — No setup required (recommended for most users)

1. Click the green **Code** button at the top of this page
2. Select **Download ZIP**
3. Unzip the downloaded file
4. Open the unzipped folder and double-click **index.html**

That's it — the app opens directly in your browser. No installation, no internet connection needed.

### Method 2 — For developers (via Git)

```bash
git clone https://github.com/waqasahmedch/linkedin-post-formatter.git
cd linkedin-post-formatter
python3 -m http.server 8000    # then visit http://localhost:8000
```

## Deploy

Drop the three files (`index.html`, `styles.css`, `script.js`) on any static host:
GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, or your own server.

## How it works

- **Bold/Italic**: Characters are remapped to the Unicode "Mathematical Alphanumeric Symbols" block (U+1D400–U+1D7FF).
- **Underline/Strikethrough**: A combining character (U+0332 or U+0336) is appended after each character.
- **Line Spacer**: Inserts a Braille blank (U+2800) on its own line — invisible but non-empty, so LinkedIn preserves the gap.

## File structure

```
linkedin-post-formatter/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## License

MIT — do whatever you want.

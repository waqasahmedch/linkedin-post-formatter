# Social Media Post Formatter

> **Free online tool** to format posts for LinkedIn, X (Twitter), Instagram, Threads, and Truth Social — with bold, italic, underline, strikethrough, bullets, emojis, hashtags and mentions. No sign-up required. Works 100% offline.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20it%20now-blue?style=for-the-badge)](https://formatpost.waziray.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/waqasahmedch/format-your-post?style=for-the-badge)](https://github.com/waqasahmedch/format-your-post/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/waqasahmedch/format-your-post?style=for-the-badge)](https://github.com/waqasahmedch/format-your-post/fork)

---

## Why This Tool?

LinkedIn, X (Twitter), Instagram, Threads, and Truth Social **do not support native text formatting** in their post composers — no bold, no italic, no underline. This tool uses **Unicode Mathematical Alphanumeric Symbols** and **combining characters** that render as formatted text on all these platforms. Write your post, apply formatting, and paste it directly — the formatting stays.

---

## Features

- ✅ **Bold, Italic, Bold-Italic** — via Unicode math character remapping
- ✅ **Underline & Strikethrough** — via Unicode combining marks
- ✅ **Bulleted and numbered lists**
- ✅ **Emoji picker** — categorised with search
- ✅ **@ Mention and # Hashtag** insertion
- ✅ **Line Spacer** — prevents LinkedIn from collapsing blank lines
- ✅ **Platform toggle** — switches character counter between LinkedIn (3,000), Instagram (2,200), Threads (500), Truth Social (500), and X (280)
- ✅ **Keyboard shortcuts** — Ctrl/Cmd + B / I / U
- ✅ **Copy to clipboard** — one click
- ✅ **Fully responsive** — mobile, tablet, desktop
- ✅ **Works offline** — no backend, no tracking, no data collection

---

## Supported Platforms

| Platform | Char Limit | Bold/Italic Works? |
|---|---|---|
| LinkedIn | 3,000 | ✅ Yes |
| X / Twitter | 280 | ✅ Yes |
| Instagram | 2,200 | ✅ Yes |
| Threads | 500 | ✅ Yes |
| Truth Social | 500 | ✅ Yes |

---

## 🚀 Live Demo

**[Try it now → https://formatpost.waziray.com](https://formatpost.waziray.com)**

---

## Run Locally

### Method 1 — No setup required (recommended for most users)

1. Click the green **Code** button at the top of this page
2. Select **Download ZIP**
3. Unzip the downloaded file
4. Open the unzipped folder and double-click **index.html**

That's it — the app opens directly in your browser. No installation, no internet connection needed.

### Method 2 — For developers (via Git)

```bash
git clone https://github.com/waqasahmedch/format-your-post.git
cd format-your-post
python3 -m http.server 8000    # then visit http://localhost:8000
```

---

## How It Works

- **Bold / Italic / Bold-Italic**: ASCII characters are remapped to Unicode Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF).
- **Underline / Strikethrough**: A combining character (`U+0332` or `U+0336`) is appended after each character.
- **Line Spacer**: Inserts a Braille blank (`U+2800`) — invisible but non-empty, so LinkedIn preserves blank lines.
- **Platform toggle**: Updates the character counter limit per platform.

---

## Privacy

Everything you type stays entirely in your browser. No server, no database, no tracking. [Review the source code](https://github.com/waqasahmedch/format-your-post) to verify.

---

## Deploy Your Own

Drop the three files (`index.html`, `styles.css`, `script.js`) on any static host:
GitHub Pages, Netlify, Vercel, Cloudflare Pages, AWS Amplify, or S3.

---

## Feedback

- 🐛 **Found a bug?** [Open a GitHub Issue](https://github.com/waqasahmedch/format-your-post/issues/new)
- 💡 **Have an idea?** [Start a GitHub Discussion](https://github.com/waqasahmedch/format-your-post/discussions)

---

## License

MIT — do whatever you want.

---

## Credits

Envisioned by **[Waqas Ahmad](https://www.linkedin.com/in/waqasahmedch)** — [Tech Blog](https://waziray.wordpress.com)

Co-authored with **[Claude](https://claude.ai)** by Anthropic

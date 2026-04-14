# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

No build step. Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Architecture

This is a single-page, zero-dependency, purely client-side app. All logic lives in one IIFE in `script.js`; no frameworks, no bundler, no npm.

**How formatting works:**

- **Bold / Italic / Bold-Italic**: ASCII characters are remapped to Unicode Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF) via offset tables in `OFFSETS`. A few italic codepoints are reserved by Unicode and require special-case patches (`ITALIC_FIX`).
- **Underline / Strikethrough**: Combining characters (`U+0332` / `U+0336`) are appended after each character rather than remapping codepoints.
- **Strip formatting** (`stripFormatting`): Reverses all of the above — reverse-maps Unicode math ranges back to ASCII and drops combining marks. This is applied before re-applying any style, so toggling/changing styles works cleanly.
- **Line spacer**: Inserts a Braille blank (`U+2800`) on its own line. It is invisible visually but non-empty, so LinkedIn does not collapse the blank line.

**Editor model**: The editor `div#editor` is `contenteditable`. Text is always plain text nodes — HTML paste is intercepted and re-inserted as plain text. The toolbar reads/writes via the Selection API (`window.getSelection()` + `Range`).

**Key functions in `script.js`:**
- `transformChar` / `transformText` — apply a style to a string
- `stripFormatting` — remove all formatting from a string
- `applyStyleToSelection` — orchestrates get selection → strip → transform → replace
- `replaceSelection` — low-level: deletes selected range, inserts new text node, repositions caret
- `prefixSelectedLines` — handles bullet/numbered list prefixing line-by-line
- `updateCharCount` — counts `editor.innerText.length` against LinkedIn's 3000-char limit

**CSS design tokens** are in `:root` vars at the top of `styles.css` (colors, radius, shadow). Mobile breakpoint at 600px.

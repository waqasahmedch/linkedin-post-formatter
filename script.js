/* =====================================================================
   LinkedIn Post Formatter
   Transforms selected text into Unicode variants that render as
   bold / italic / underline / strikethrough on LinkedIn.
   ===================================================================== */

(function () {
  'use strict';

  // ---------- Unicode offset maps ----------
  // Plain ASCII -> Mathematical Alphanumeric Symbols
  const OFFSETS = {
    bold:       { upper: 0x1D400 - 0x41, lower: 0x1D41A - 0x61, digit: 0x1D7CE - 0x30 },
    italic:     { upper: 0x1D434 - 0x41, lower: 0x1D44E - 0x61, digit: null },
    bolditalic: { upper: 0x1D468 - 0x41, lower: 0x1D482 - 0x61, digit: null },
  };

  // A few italic letters are "reserved" in Unicode and must be patched
  const ITALIC_FIX = { 'h': 0x210E };
  const BOLDITALIC_FIX = {}; // none needed

  // Combining characters
  const COMBINE_UNDERLINE = '\u0332';
  const COMBINE_STRIKE    = '\u0336';

  // Invisible line spacer (Hangul filler - safe on LinkedIn)
  const LINE_SPACER = '\u2800'; // Braille blank; visible to parsers, invisible visually

  // ---------- Transform helpers ----------
  function transformChar(ch, style) {
    const code = ch.codePointAt(0);

    if (style === 'underline') return ch + COMBINE_UNDERLINE;
    if (style === 'strike')    return ch + COMBINE_STRIKE;

    const map = OFFSETS[style];
    if (!map) return ch;

    // Italic fixups
    if (style === 'italic' && ITALIC_FIX[ch]) return String.fromCodePoint(ITALIC_FIX[ch]);

    if (code >= 0x41 && code <= 0x5A && map.upper !== null)       return String.fromCodePoint(code + map.upper);
    if (code >= 0x61 && code <= 0x7A && map.lower !== null)       return String.fromCodePoint(code + map.lower);
    if (code >= 0x30 && code <= 0x39 && map.digit !== null)       return String.fromCodePoint(code + map.digit);

    return ch;
  }

  function transformText(text, style) {
    // Iterate code points (handles surrogate pairs gracefully)
    let out = '';
    for (const ch of text) {
      // Skip existing combining marks to avoid double-apply
      if (ch === COMBINE_UNDERLINE || ch === COMBINE_STRIKE) continue;
      out += transformChar(ch, style);
    }
    return out;
  }

  // Strip formatting: reverse-map bold/italic back to ASCII + remove combining marks
  function stripFormatting(text) {
    let out = '';
    for (const ch of text) {
      if (ch === COMBINE_UNDERLINE || ch === COMBINE_STRIKE) continue;
      const cp = ch.codePointAt(0);
      let plain = ch;

      // Check each style's ranges
      for (const style of ['bold', 'italic', 'bolditalic']) {
        const m = OFFSETS[style];
        if (m.upper !== null) {
          const start = 0x41 + m.upper, end = 0x5A + m.upper;
          if (cp >= start && cp <= end) { plain = String.fromCharCode(cp - m.upper); break; }
        }
        if (m.lower !== null) {
          const start = 0x61 + m.lower, end = 0x7A + m.lower;
          if (cp >= start && cp <= end) { plain = String.fromCharCode(cp - m.lower); break; }
        }
        if (m.digit !== null) {
          const start = 0x30 + m.digit, end = 0x39 + m.digit;
          if (cp >= start && cp <= end) { plain = String.fromCharCode(cp - m.digit); break; }
        }
      }
      // Italic 'h' special case
      if (cp === 0x210E) plain = 'h';
      out += plain;
    }
    return out;
  }

  // ---------- Selection / editor helpers ----------
  const editor = document.getElementById('editor');

  function getSelectionInEditor() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return null;
    return { sel, range };
  }

  function replaceSelection(newText) {
    const info = getSelectionInEditor();
    if (!info) {
      // No selection — insert at end
      editor.focus();
      document.execCommand('insertText', false, newText);
      return;
    }
    const { range } = info;
    range.deleteContents();
    const node = document.createTextNode(newText);
    range.insertNode(node);
    // Move caret to end of inserted text
    range.setStartAfter(node);
    range.setEndAfter(node);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    updateCharCount();
  }

  function getSelectedText() {
    const info = getSelectionInEditor();
    if (!info) return '';
    return info.sel.toString();
  }

  function applyStyleToSelection(style) {
    const txt = getSelectedText();
    if (!txt) {
      flashStatus('Select some text first', true);
      return;
    }
    // Always strip first so toggling works cleanly
    const plain = stripFormatting(txt);
    const transformed = transformText(plain, style);
    replaceSelection(transformed);
  }

  function clearSelectionFormatting() {
    const txt = getSelectedText();
    if (!txt) { flashStatus('Select some text first', true); return; }
    replaceSelection(stripFormatting(txt));
  }

  // ---------- Lists ----------
  function prefixSelectedLines(prefixFn) {
    const info = getSelectionInEditor();
    if (!info) { editor.focus(); return; }
    const txt = info.sel.toString();
    if (!txt) {
      // Insert a single bullet/number at caret on its own line
      replaceSelection('\n' + prefixFn(1) + ' ');
      return;
    }
    const lines = txt.split('\n');
    const out = lines.map((line, i) => line.trim() ? prefixFn(i + 1) + ' ' + line : line).join('\n');
    replaceSelection(out);
  }

  function insertAtCaret(text) {
    const info = getSelectionInEditor();
    if (!info) {
      editor.focus();
      editor.appendChild(document.createTextNode(text));
      updateCharCount();
      return;
    }
    const { range } = info;
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    updateCharCount();
  }

  // ---------- Actions ----------
  const ACTIONS = {
    bold:       () => applyStyleToSelection('bold'),
    italic:     () => applyStyleToSelection('italic'),
    bolditalic: () => applyStyleToSelection('bolditalic'),
    underline:  () => applyStyleToSelection('underline'),
    strike:     () => applyStyleToSelection('strike'),
    bullet:     () => prefixSelectedLines(() => '•'),
    numbered:   () => prefixSelectedLines((n) => n + '.'),
    spacer:     () => insertAtCaret('\n' + LINE_SPACER + '\n'),
    'clear-format': () => clearSelectionFormatting(),
  };

  document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const fn = ACTIONS[btn.dataset.action];
      if (fn) fn();
    });
  });

  // ---------- Keyboard shortcuts ----------
  editor.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === 'b') { e.preventDefault(); ACTIONS.bold(); }
    else if (k === 'i') { e.preventDefault(); ACTIONS.italic(); }
    else if (k === 'u') { e.preventDefault(); ACTIONS.underline(); }
  });

  // ---------- Paste: strip HTML (keep plain text) ----------
  editor.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  // ---------- Copy ----------
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', async () => {
    const text = editor.innerText;
    if (!text.trim()) { flashStatus('Nothing to copy', true); return; }
    try {
      await navigator.clipboard.writeText(text);
      flashStatus('✓ Copied! Paste into LinkedIn.');
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); flashStatus('✓ Copied! Paste into LinkedIn.'); }
      catch { flashStatus('Copy failed — please copy manually', true); }
      ta.remove();
    }
  });

  // ---------- Reset ----------
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!editor.innerText.trim() || confirm('Clear the editor?')) {
      editor.innerHTML = '';
      updateCharCount();
      flashStatus('Editor cleared');
    }
  });

  // ---------- Char counter ----------
  const charCount = document.getElementById('charCount');
  function updateCharCount() {
    const n = editor.innerText.length;
    charCount.textContent = `${n} / 3000`;
    charCount.classList.remove('char-warn', 'char-over');
    if (n > 3000) charCount.classList.add('char-over');
    else if (n > 2700) charCount.classList.add('char-warn');
  }
  editor.addEventListener('input', updateCharCount);
  updateCharCount();

  // ---------- Status flash ----------
  const statusMsg = document.getElementById('statusMsg');
  let statusTimer = null;
  function flashStatus(msg, isError) {
    statusMsg.textContent = msg;
    statusMsg.classList.toggle('error', !!isError);
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { statusMsg.textContent = ''; }, 2500);
  }

  // ---------- Emoji picker ----------
  const EMOJI = {
    'Smileys': ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥳','🤩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭'],
    'Gestures': ['👍','👎','👌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐','🖖','👋','🤝','👏','🙌','👐','🤲','🙏','💪','🦾','✍️','💅'],
    'Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟'],
    'Work': ['💼','📊','📈','📉','📋','📌','📍','📎','🖇','📅','📆','🗓','🗒','🗃','📂','📁','📑','🔖','🏷','📰','📧','📨','📩','📤','📥','📫','✉️','💻','⌨️','🖥','🖱','🖨','📱','☎️','📞','🕐','⏰','⏳','⌛'],
    'Objects': ['💡','🔦','🕯','🗑','🔋','🔌','🧲','🧰','🔧','🔨','⚒','🛠','⛏','🔩','⚙️','🧱','🔗','⛓','🧪','🧫','🧬','🔬','🔭','📡','💉','💊','🩺','🚪','🛋','🛏','🖼','🪞','🪟','🛒','🎁','🎈','🎉','🎊','🎂','🍾'],
    'Arrows': ['➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔃','🔄','🔙','🔚','🔛','🔜','🔝'],
    'Symbols': ['✅','☑️','✔️','❌','❎','⭕','🚫','⛔','📛','🔰','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','❗','❓','❕','❔','‼️','⁉️','💤','💭','💬','🗯','♻️','⚜️','🔱','📢','📣','📯','🔔','🔕','⭐','🌟','✨','⚡','☄️','💥','🔥','🌈','☀️','🌤','⛅','🌥','☁️','🌦','🌧','⛈','🌩','🌨','❄️','☃️','⛄']
  };

  const emojiBtn = document.getElementById('emojiBtn');
  const emojiPicker = document.getElementById('emojiPicker');
  const emojiCategories = document.getElementById('emojiCategories');
  const emojiGrid = document.getElementById('emojiGrid');
  const emojiSearch = document.getElementById('emojiSearch');

  let activeCat = Object.keys(EMOJI)[0];

  function renderEmojiCategories() {
    emojiCategories.innerHTML = '';
    Object.keys(EMOJI).forEach(cat => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'emoji-cat-btn' + (cat === activeCat ? ' active' : '');
      b.textContent = EMOJI[cat][0];
      b.title = cat;
      b.addEventListener('click', () => {
        activeCat = cat;
        emojiSearch.value = '';
        renderEmojiCategories();
        renderEmojiGrid(EMOJI[cat]);
      });
      emojiCategories.appendChild(b);
    });
  }

  function renderEmojiGrid(list) {
    emojiGrid.innerHTML = '';
    list.forEach(e => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'emoji-item';
      b.textContent = e;
      b.addEventListener('click', () => {
        editor.focus();
        insertAtCaret(e);
      });
      emojiGrid.appendChild(b);
    });
  }

  emojiBtn.addEventListener('click', () => {
    const hidden = emojiPicker.hidden;
    emojiPicker.hidden = !hidden;
    if (hidden) {
      renderEmojiCategories();
      renderEmojiGrid(EMOJI[activeCat]);
      emojiSearch.focus();
    }
  });

  emojiSearch.addEventListener('input', () => {
    const q = emojiSearch.value.trim();
    if (!q) { renderEmojiGrid(EMOJI[activeCat]); return; }
    // Simple: show all emoji if user types (naive search — emoji don't have names here)
    const all = Object.values(EMOJI).flat();
    renderEmojiGrid(all);
  });

  // Close emoji picker when clicking outside
  document.addEventListener('click', (e) => {
    if (emojiPicker.hidden) return;
    if (emojiPicker.contains(e.target) || emojiBtn.contains(e.target)) return;
    emojiPicker.hidden = true;
  });

  // ---------- Initial focus ----------
  editor.focus();
})();

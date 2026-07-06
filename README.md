# ♥ Be My Valentine — Pixel RPG Quest

A tiny browser game that turns "Will you be my Valentine?" into a retro pixel-RPG
boss battle. The **NO** button is an enemy ("No-Slime") that dodges every time you
go near it, while the **YES** button grows. Say yes → confetti + victory screen.

No build tools, no dependencies. Just open it.

## Files

```
valentine-quest/
├── index.html        ← the page (open this)
├── css/style.css     ← all styling
├── js/script.js      ← all game logic
└── README.md
```

## Run it locally

**Easiest:** double-click `index.html` — it opens in your browser and works.

**Or serve it** (recommended if anything looks off):

```bash
cd valentine-quest
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Personalize

Open `js/script.js` and edit the first line:

```js
const CRUSH_NAME = "";   // e.g. "Sam"
```

Leave it blank to keep it generic.

## Put it online (so you can send a link)

Any static host works. Two quick options:

- **GitHub Pages** — push this folder to a repo, enable Pages on the `main`
  branch, and share the URL.
- **Netlify / Vercel drop** — drag the `valentine-quest` folder onto their
  dashboard and you get a live link in seconds.

## Notes

- Works on desktop and mobile (the No button dodges on touch too).
- Respects `prefers-reduced-motion` — animations calm down if the visitor
  has that system setting on.
- There's a gentle "let me just answer normally" link and a no-pressure
  screen if someone genuinely wants to decline. It's a joke, not a trap.

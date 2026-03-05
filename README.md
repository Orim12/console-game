# Coding Game (single-file JS)

This repository contains `game.js` — a single-file, dependency-free clicker-style JavaScript game (like Cookie Clicker). Host on GitHub and load it on any website via the console or a bookmarklet.

Quick usage
- Host this repo on GitHub and push `game.js` to `main`.
- Recommended CDN (jsDelivr) URL:
  - `https://cdn.jsdelivr.net/gh/USER/REPO@main/game.js`
- Console loader (paste into the browser console):

```javascript
var s=document.createElement('script');
s.src='https://cdn.jsdelivr.net/gh/USER/REPO@main/game.js';
document.body.appendChild(s);
```

- Bookmarklet (replace `USER/REPO`):

```
javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/USER/REPO@main/game.js';document.body.appendChild(s);})();
```

About the game
- Click the large button to earn coins (coins per click = `cpc`).
- Buy upgrades:
  - `Cursor` — adds +1 CPS (coins per second).
  - `Tutor` — adds +1 CPC.
- Progress is saved in `localStorage` under the key `codingclicker:v1`.

Dev API (in page console)
- `window.CodingGame.getState()` — returns current saved state.
- `window.CodingGame.addCoins(n)` — add `n` coins programmatically.

Next steps
- Replace `USER/REPO` with your GitHub username/repo once pushed. Optionally minify `game.js` for a compact bookmarklet.

License
- Choose a license before publishing (MIT recommended).

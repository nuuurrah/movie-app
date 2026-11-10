# 🎬 CineCards — Movie App

A responsive movie browser that shows each film as a UI card. You can search, filter by genre, sort, save favorites, and open a details view for any movie.

Built with plain **HTML, CSS and JavaScript**. There is no framework and no build step.

---

## ✨ Features

- **Movie cards:** each card shows the poster, title, year, rating and genre tags
- **Search:** live search by title or director (debounced)
- **Genre filter:** the genre list is built from whatever data is loaded
- **Sorting:** top rated, newest, oldest, A–Z
- **Favorites:** tap ♡ to save a movie. Favorites are stored in `localStorage`, so they stay after a reload
- **Details modal:** overview, runtime, director and genres
- **Responsive:** 2 columns on mobile, more on wider screens
- **Accessible:** cards work with the keyboard (Tab + Enter) and have ARIA labels; the modal uses the native `<dialog>` element
- **Optional live data:** add a TMDB API key to load popular movies with real posters

---

## 🗂️ Project Structure

```
movie-app/
├── index.html        # Page layout: header, controls, grid, modal
├── style.css         # Dark theme, card grid, modal, responsive rules
├── app.js            # State, data loading, filtering, rendering, events
├── config.js         # Optional TMDB API key
├── data/
│   └── movies.js     # Sample data (16 films)
├── README.md
└── SPEC.md           # Short project spec
```

---

## 🚀 Getting Started

1. Clone or download the project:
   ```bash
   git clone <your-repo-url>
   cd movie-app
   ```
2. Open `index.html` in your browser, **or** run a local server:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```
3. Go to `http://localhost:8000`.

### Optional: live data from TMDB

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/) and request an API key (Settings → API).
2. Paste the key into `config.js`:
   ```js
   const CONFIG = { TMDB_API_KEY: "your_key_here" };
   ```
3. Reload the page. If the API can't be reached, the app falls back to the sample data.

> ⚠️ Don't commit a real API key to a public repo. Add `config.js` to `.gitignore` if you use one.

---

## 🛠️ Tech Stack

| Layer   | Tool                                  |
|---------|---------------------------------------|
| Markup  | HTML5 (semantic tags, `<dialog>`)     |
| Styling | CSS3 (Grid, custom properties, media queries) |
| Logic   | Vanilla JavaScript (ES6+, `fetch`, `async/await`) |
| Storage | `localStorage`                        |
| API     | TMDB REST API (optional)              |

---

## 🧠 How It Works

- All UI state lives in one `state` object: movies, query, genre, sort, favorites.
- `visibleMovies()` filters and sorts the list from that state.
- `render()` rebuilds the grid from `visibleMovies()`, so every control just updates `state` and calls `render()`.
- Clicks on cards and buttons are handled by **event delegation** with one listener on the grid.
- When a film has no poster image, the app draws a gradient whose colour is generated from the title.

---

## 🔮 Future Improvements

- Pagination / infinite scroll for TMDB results
- Trailer embeds in the details modal
- Light/dark theme toggle
- Watchlist with "watched" status
- Unit tests for filtering and sorting

---

## 🤖 AI Usage

The project structure, code, this README and `SPEC.md` were generated with the help of an AI assistant (Claude). I then reviewed and tested them.

## 📄 License

MIT. Free to use for learning.

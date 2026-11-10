# Project Spec — CineCards Movie App

## 1. Overview
CineCards is a single-page web app for browsing movies. Each film is shown as a UI card. Users can search, filter, sort, save favorites and open movie details.

## 2. Goals
- Show a clean, responsive grid of movie cards.
- Let users find a movie quickly (search, filter, sort).
- Keep favorites saved between visits.
- Work without any setup (sample data), with optional live data from TMDB.

## 3. Target Users
Casual movie fans who want a quick, visual way to browse films and keep a short list of favorites.

## 4. Functional Requirements
| ID  | Requirement |
|-----|-------------|
| F1  | Display movies as cards with poster, title, year, rating and up to 2 genre tags. |
| F2  | Search by title or director; results update as the user types. |
| F3  | Filter by a single genre, chosen from a dropdown built from the data. |
| F4  | Sort by rating, newest, oldest or title. |
| F5  | Add/remove favorites with a heart button; save them in `localStorage`. |
| F6  | "Favorites" toggle shows only saved movies. |
| F7  | Clicking a card opens a modal with overview, year, runtime, director and genres. |
| F8  | If a TMDB API key is set, load popular movies from TMDB; otherwise (or on error) use sample data. |
| F9  | Show helpful empty states ("No movies match", "No favorites yet"). |

## 5. Non-Functional Requirements
- **Responsive:** usable from 360px phones up to desktop.
- **Accessible:** keyboard navigation, ARIA labels, visible focus states.
- **Performance:** no framework; lazy-loaded images; debounced search.
- **Security:** all text is escaped before it is inserted into the page.

## 6. Data Model
```js
Movie {
  id: number,
  title: string,
  year: number | null,
  rating: number,        // 0–10
  runtime?: number,      // minutes
  director?: string,
  genres: string[],
  overview: string,
  poster?: string        // image URL (TMDB only)
}
```

## 7. Tech Stack
HTML5 · CSS3 (Grid, Flexbox) · Vanilla JavaScript (ES6+) · localStorage · TMDB API (optional)

## 8. UI Components
- **Header:** logo, search input, genre select, sort select, favorites toggle
- **Card grid:** movie cards with hover lift and a heart button
- **Details modal:** native `<dialog>`
- **Status line:** result count / empty-state messages
- **Skeleton loaders:** shown while data loads

## 9. Out of Scope (v1)
User accounts, backend/database, reviews, trailers, pagination.

## 10. Acceptance Criteria
- The page loads and shows 16 sample cards with no setup.
- Search, genre filter and sort can be combined and update instantly.
- A favorited movie is still favorited after a page reload.
- The details modal opens with click or Enter and closes with ✕, Esc or a backdrop click.
- The layout has no horizontal scrolling at 360px width.

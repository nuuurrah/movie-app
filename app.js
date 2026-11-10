// CineCards — Movie App
// Renders a grid of movie cards with search, genre filter, sorting,
// favorites (saved in localStorage) and a details modal.

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const FAV_KEY = "cinecards:favorites";

const state = {
  movies: [],
  query: "",
  genre: "all",
  sort: "rating",
  favoritesOnly: false,
  favorites: loadFavorites(),
};

// ---------- DOM ----------
const $ = (sel) => document.querySelector(sel);
const grid = $("#grid");
const statusEl = $("#status");
const searchEl = $("#search");
const genreEl = $("#genre");
const sortEl = $("#sort");
const favToggle = $("#favToggle");
const modal = $("#modal");
const modalBody = $("#modalBody");

// ---------- Storage ----------
function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []);
  } catch {
    return new Set();
  }
}
function saveFavorites() {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...state.favorites]));
  } catch {
    /* storage unavailable — favorites last for this visit only */
  }
}

// ---------- Data ----------
async function loadMovies() {
  showSkeletons();
  const key = typeof CONFIG !== "undefined" && CONFIG.TMDB_API_KEY;
  if (key) {
    try {
      return await fetchFromTMDB(key);
    } catch (err) {
      console.warn("TMDB failed, using sample data:", err);
      statusEl.textContent = "Couldn't reach TMDB — showing sample movies.";
    }
  }
  return SAMPLE_MOVIES;
}

async function fetchFromTMDB(key) {
  const base = "https://api.themoviedb.org/3";
  const [genreRes, movieRes] = await Promise.all([
    fetch(`${base}/genre/movie/list?api_key=${key}`),
    fetch(`${base}/movie/popular?api_key=${key}`),
  ]);
  if (!genreRes.ok || !movieRes.ok) throw new Error("TMDB request failed");
  const { genres } = await genreRes.json();
  const { results } = await movieRes.json();
  const genreMap = Object.fromEntries(genres.map((g) => [g.id, g.name]));

  return results.map((m) => ({
    id: m.id,
    title: m.title,
    year: Number((m.release_date || "").slice(0, 4)) || null,
    rating: Math.round(m.vote_average * 10) / 10,
    genres: m.genre_ids.map((id) => genreMap[id]).filter(Boolean),
    overview: m.overview,
    poster: m.poster_path ? TMDB_IMG + m.poster_path : null,
  }));
}

// ---------- Helpers ----------
function escapeHTML(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Deterministic gradient so each film gets its own "poster" without images.
function gradientFor(title) {
  let h = 0;
  for (const ch of title) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `linear-gradient(160deg, hsl(${h} 65% 45%), hsl(${(h + 60) % 360} 70% 18%))`;
}

function posterHTML(movie) {
  if (movie.poster) {
    return `<img class="poster" src="${movie.poster}" alt="Poster for ${escapeHTML(movie.title)}" loading="lazy" />`;
  }
  return `<div class="poster" style="background:${gradientFor(movie.title)}" aria-hidden="true">${escapeHTML(movie.title)}</div>`;
}

// ---------- Filtering & sorting ----------
function visibleMovies() {
  const q = state.query.trim().toLowerCase();
  const list = state.movies.filter((m) => {
    if (state.favoritesOnly && !state.favorites.has(m.id)) return false;
    if (state.genre !== "all" && !m.genres.includes(state.genre)) return false;
    if (q && !(m.title.toLowerCase().includes(q) || (m.director || "").toLowerCase().includes(q))) return false;
    return true;
  });

  const sorters = {
    rating: (a, b) => b.rating - a.rating,
    "year-desc": (a, b) => (b.year || 0) - (a.year || 0),
    "year-asc": (a, b) => (a.year || 0) - (b.year || 0),
    title: (a, b) => a.title.localeCompare(b.title),
  };
  return list.sort(sorters[state.sort]);
}

// ---------- Rendering ----------
function showSkeletons(n = 8) {
  grid.innerHTML = Array.from({ length: n }, () => `<div class="skeleton"></div>`).join("");
}

function cardHTML(movie) {
  const fav = state.favorites.has(movie.id);
  return `
    <article class="card" tabindex="0" data-id="${movie.id}" aria-label="${escapeHTML(movie.title)}">
      ${posterHTML(movie)}
      <button class="fav ${fav ? "active" : ""}" data-fav="${movie.id}"
        aria-label="${fav ? "Remove from" : "Add to"} favorites" aria-pressed="${fav}">${fav ? "♥" : "♡"}</button>
      <div class="card-body">
        <h3 class="card-title">${escapeHTML(movie.title)}</h3>
        <div class="meta">
          <span>${movie.year ?? "—"}</span>
          <span class="rating">★ ${movie.rating.toFixed(1)}</span>
        </div>
        <div class="genres">${movie.genres.slice(0, 2).map((g) => `<span class="tag">${escapeHTML(g)}</span>`).join("")}</div>
      </div>
    </article>`;
}

function render() {
  const list = visibleMovies();
  grid.innerHTML = list.map(cardHTML).join("");
  statusEl.textContent = list.length
    ? `Showing ${list.length} of ${state.movies.length} movies`
    : state.favoritesOnly
      ? "No favorites yet — tap ♡ on a card to save it."
      : "No movies match your search.";
}

function populateGenres() {
  const genres = [...new Set(state.movies.flatMap((m) => m.genres))].sort();
  genreEl.insertAdjacentHTML("beforeend", genres.map((g) => `<option value="${escapeHTML(g)}">${escapeHTML(g)}</option>`).join(""));
}

function openDetails(id) {
  const m = state.movies.find((x) => x.id === id);
  if (!m) return;
  modalBody.innerHTML = `
    <div class="detail">
      ${posterHTML(m)}
      <div class="detail-info">
        <h2>${escapeHTML(m.title)}</h2>
        <span class="rating">★ ${m.rating.toFixed(1)} / 10</span>
        <p>${escapeHTML(m.overview || "No overview available.")}</p>
        <dl>
          <dt>Year</dt><dd>${m.year ?? "—"}</dd>
          ${m.runtime ? `<dt>Runtime</dt><dd>${m.runtime} min</dd>` : ""}
          ${m.director ? `<dt>Director</dt><dd>${escapeHTML(m.director)}</dd>` : ""}
          <dt>Genres</dt><dd>${m.genres.map(escapeHTML).join(", ")}</dd>
        </dl>
      </div>
    </div>`;
  modal.showModal();
}

function toggleFavorite(id) {
  state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
  saveFavorites();
  render();
}

// ---------- Events ----------
let searchTimer;
searchEl.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.query = e.target.value;
    render();
  }, 200);
});
genreEl.addEventListener("change", (e) => { state.genre = e.target.value; render(); });
sortEl.addEventListener("change", (e) => { state.sort = e.target.value; render(); });
favToggle.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  favToggle.setAttribute("aria-pressed", state.favoritesOnly);
  render();
});

grid.addEventListener("click", (e) => {
  const favBtn = e.target.closest("[data-fav]");
  if (favBtn) {
    e.stopPropagation();
    return toggleFavorite(Number(favBtn.dataset.fav));
  }
  const card = e.target.closest(".card");
  if (card) openDetails(Number(card.dataset.id));
});
grid.addEventListener("keydown", (e) => {
  const card = e.target.closest(".card");
  if (card && e.target === card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openDetails(Number(card.dataset.id));
  }
});

$("#closeModal").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

// ---------- Init ----------
(async function init() {
  state.movies = await loadMovies();
  populateGenres();
  render();
})();

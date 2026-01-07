// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   Mobile Menu Toggle
========================= */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");

if (nav && navToggle) {
  const closeMenu = () => {
    nav.classList.remove("isOpen");
    navToggle.classList.remove("isOpen");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("noScroll");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("isOpen");
    navToggle.classList.toggle("isOpen", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("noScroll", isOpen);
  });

  // Close on click any nav link
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeMenu());
  });

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close on outside click (mobile)
  document.addEventListener("click", (e) => {
    const clickedInside = nav.contains(e.target) || navToggle.contains(e.target);
    if (!clickedInside && nav.classList.contains("isOpen")) closeMenu();
  });
}

/* =========================
   Active nav on scroll
========================= */
const sections = [...document.querySelectorAll("section, main.hero")];
const navLinks = [...document.querySelectorAll(".nav a")];

function setActive() {
  const y = window.scrollY + 140;
  let currentId = "home";

  for (const s of sections) {
    const top = s.offsetTop;
    const bottom = top + s.offsetHeight;
    if (y >= top && y < bottom) {
      currentId = s.id || "home";
      break;
    }
  }

  navLinks.forEach(a => {
    const href = a.getAttribute("href")?.replace("#", "");
    if (href === currentId) a.classList.add("isActive");
    else a.classList.remove("isActive");
  });
}
window.addEventListener("scroll", setActive, { passive: true });
setActive();

/* =========================
   Projects: Filter + Search
========================= */
const projectCards = [...document.querySelectorAll(".projectCard")];
const filterBtns = [...document.querySelectorAll(".filterBtn")];
const searchInput = document.getElementById("projSearch");

let activeFilter = "all";
let searchTerm = "";

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

function matchesFilter(card) {
  if (activeFilter === "all") return true;
  const tags = normalize(card.getAttribute("data-tags"));
  return tags.split(/\s+/).includes(activeFilter);
}

function matchesSearch(card) {
  if (!searchTerm) return true;
  const title = normalize(card.querySelector("h3")?.textContent);
  const desc = normalize(card.querySelector("p")?.textContent);
  const tags = normalize(card.getAttribute("data-tags"));
  return (title + " " + desc + " " + tags).includes(searchTerm);
}

function applyProjectsView() {
  projectCards.forEach(card => {
    const show = matchesFilter(card) && matchesSearch(card);
    card.classList.toggle("isHidden", !show);
  });
}

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("isActive"));
      btn.classList.add("isActive");
      activeFilter = btn.getAttribute("data-filter") || "all";
      applyProjectsView();
    });
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchTerm = normalize(e.target.value);
    applyProjectsView();
  });
}

// initial
applyProjectsView();

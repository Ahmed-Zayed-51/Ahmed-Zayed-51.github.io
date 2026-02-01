// ===============================
// Footer year
// ===============================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===============================
// Active nav on scroll
// ===============================
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
    const href = (a.getAttribute("href") || "").replace("#", "");
    if (href === currentId) a.classList.add("isActive");
    else a.classList.remove("isActive");
  });
}
window.addEventListener("scroll", setActive);
setActive();

// ===============================
// Mobile menu
// ===============================
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("isOpen");
    burger.setAttribute("aria-expanded", String(isOpen));
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
  });

  // Close on click
  [...mobileNav.querySelectorAll("a")].forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.classList.remove("isOpen");
      burger.setAttribute("aria-expanded", "false");
      mobileNav.setAttribute("aria-hidden", "true");
    });
  });
}

// ===============================
// Projects filter + search
// ===============================
const filterButtons = [...document.querySelectorAll(".filterBtn")];
const projectCards = [...document.querySelectorAll(".projectCard")];
const projectSearch = document.getElementById("projectSearch");

let activeFilter = "all";
let searchTerm = "";

function applyProjectsFilter() {
  projectCards.forEach(card => {
    const tags = (card.getAttribute("data-tags") || "").toLowerCase();
    const title = (card.querySelector("h3")?.textContent || "").toLowerCase();
    const desc = (card.querySelector("p")?.textContent || "").toLowerCase();

    const matchFilter = activeFilter === "all" ? true : tags.includes(activeFilter);
    const matchSearch = !searchTerm ? true : (title.includes(searchTerm) || desc.includes(searchTerm));

    card.style.display = (matchFilter && matchSearch) ? "" : "none";
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("isActive"));
    btn.classList.add("isActive");

    activeFilter = (btn.getAttribute("data-filter") || "all").toLowerCase();
    applyProjectsFilter();
  });
});

if (projectSearch) {
  projectSearch.addEventListener("input", (e) => {
    searchTerm = (e.target.value || "").trim().toLowerCase();
    applyProjectsFilter();
  });
}

applyProjectsFilter();

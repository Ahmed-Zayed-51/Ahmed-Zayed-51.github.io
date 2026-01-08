// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   Active nav on scroll
========================= */
const sections = [...document.querySelectorAll("section, main.hero")];
const navLinks = [...document.querySelectorAll(".nav a")];

function setActiveNav() {
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
window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();

/* =========================
   Mobile menu
========================= */
const navToggle = document.querySelector(".navToggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("isOpen");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // close when clicking a link
  navLinks.forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("isOpen");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    const target = e.target;
    const clickedInside = nav.contains(target) || navToggle.contains(target);
    if (!clickedInside) {
      nav.classList.remove("isOpen");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* =========================
   Projects search + filter
========================= */
const searchInput = document.getElementById("projectSearch");
const filterBtns = [...document.querySelectorAll(".filterBtn")];
const projectCards = [...document.querySelectorAll(".projectCard")];

let activeFilter = "all";
let searchTerm = "";

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

function applyProjectsFilter() {
  projectCards.forEach(card => {
    const title = normalize(card.querySelector("h3")?.textContent);
    const desc = normalize(card.querySelector("p")?.textContent);
    const tags = normalize(card.getAttribute("data-tags"));

    const matchesSearch =
      !searchTerm ||
      title.includes(searchTerm) ||
      desc.includes(searchTerm) ||
      tags.includes(searchTerm);

    const matchesFilter =
      activeFilter === "all" ||
      tags.split(" ").includes(activeFilter);

    card.style.display = (matchesSearch && matchesFilter) ? "" : "none";
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchTerm = normalize(e.target.value);
    applyProjectsFilter();
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("isActive"));
    btn.classList.add("isActive");
    activeFilter = btn.getAttribute("data-filter") || "all";
    applyProjectsFilter();
  });
});

applyProjectsFilter();

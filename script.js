// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Active nav on scroll
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

// Mobile menu
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

// Projects filter + search
const filterButtons = [...document.querySelectorAll(".filterBtn")];
const projectSearch = document.getElementById("projectSearch");

// ✅ Keep only real projects that have a working link (remove empty/placeholder cards)
function isValidProjectCard(card) {
  if (!card) return false;
  if (card.classList.contains('isPlaceholder')) return false;
  const link = card.querySelector('a[href]');
  if (!link) return false;
  const href = (link.getAttribute('href') || '').trim();
  if (!href || href === '#' || href.startsWith('javascript:')) return false;
  // Disabled link pattern
  if (link.classList.contains('btnDisabled') || link.getAttribute('aria-disabled') === 'true') return false;
  return true;
}

const projectsGrid = document.getElementById('projectsGrid');
if (projectsGrid) {
  [...projectsGrid.querySelectorAll('.projectCard')].forEach(card => {
    if (!isValidProjectCard(card)) card.remove();
  });
}

// Rebuild list after removals
let projectCards = [...document.querySelectorAll(".projectCard")];

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


// Smooth anchor scroll (Bolt-like)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',(e)=>{
    const id=a.getAttribute('href');
    const target=document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block:'start'
    });
    history.pushState(null,'',id);
  });
});

// Featured Projects (auto-generate from first 3 project cards)
(function(){
  const grid = document.getElementById('projectsGrid');
  if(!grid) return;
  // Only valid cards (already cleaned) + that have real links
  const cards = [...grid.querySelectorAll('.projectCard')].filter(isValidProjectCard);
  if(cards.length < 2) return;

  const featured = cards.slice(0,3).map(c => c.cloneNode(true));
  const wrap = document.createElement('div');
  wrap.className = 'featuredWrap';
  wrap.innerHTML = `
    <div class="featuredHeader">
      <h3>Featured Projects</h3>
      <span class="muted">Case-study style highlights</span>
    </div>
    <div class="featuredGrid"></div>
  `;
  const fg = wrap.querySelector('.featuredGrid');
  featured.forEach(c => {
    c.classList.add('isFeatured');
    fg.appendChild(c);
  });
  grid.parentElement.insertBefore(wrap, grid);
})();

// Scroll reveal (Bolt-like)
(function(){
  const revealEls = document.querySelectorAll('.card,.miniCard,.statCard,.projectCard,.serviceCard,.certCard,.aboutCard,.contactCard,.itemCard');
  revealEls.forEach(el => el.classList.add('reveal'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => el.classList.add('isVisible'));
    return;
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('isVisible'); });
  },{ threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  revealEls.forEach(el => io.observe(el));
})();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Active nav on scroll (simple)
const sections = [...document.querySelectorAll("section, main.hero")];
const navLinks = [...document.querySelectorAll(".nav a")];

function setActive() {
  const y = window.scrollY + 120;
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
window.addEventListener("scroll", setActive);
setActive();

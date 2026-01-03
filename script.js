// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn?.addEventListener("click", () => {
  const isOpen = mobileMenu.style.display === "block";
  mobileMenu.style.display = isOpen ? "none" : "block";
});

// Featured GitHub Projects
async function loadFeatured() {
  const container = document.getElementById("featuredProjects");
  if (!container) return;

  try {
    const res = await fetch("https://api.github.com/users/Ahmed-Zayed-51/repos?sort=updated&per_page=100");
    if (!res.ok) throw new Error("GitHub API error");
    const repos = await res.json();

    // Filter out forks and empty descriptions, take top 2
    const featured = repos
      .filter(r => !r.fork)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 2);

    container.innerHTML = "";

    featured.forEach(repo => {
      const tech = [];
      if (repo.language) tech.push(repo.language);
      // Add a couple of smart badges based on common keywords
      const nameDesc = `${repo.name} ${repo.description || ""}`.toLowerCase();
      if (nameDesc.includes("power bi")) tech.push("Power BI");
      if (nameDesc.includes("sql")) tech.push("SQL");
      if (nameDesc.includes("python")) tech.push("Python");
      if (nameDesc.includes("excel")) tech.push("Excel");

      const badges = [...new Set(tech)].slice(0, 4)
        .map(t => `<span>${t}</span>`).join("");

      container.insertAdjacentHTML("beforeend", `
        <div class="card projectCard">
          <div class="tag">Featured</div>
          <h4>${repo.name}</h4>
          <p>${repo.description ? repo.description : "A data project showcasing analysis, insights, and reporting."}</p>
          <div class="badges">${badges}</div>
          <a class="link" href="${repo.html_url}" target="_blank" rel="noreferrer">GitHub Repo →</a>
        </div>
      `);
    });

    if (featured.length === 0) {
      container.innerHTML = `<div class="card">No public repos found yet. Add your projects to GitHub and they’ll appear here automatically.</div>`;
    }
  } catch (e) {
    container.innerHTML = `
      <div class="card">
        Couldn't load GitHub repos right now (rate limit). Refresh later.
      </div>`;
  }
}

loadFeatured();

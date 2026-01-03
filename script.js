async function loadGithub() {
  const grid = document.getElementById("gh-grid");
  const loading = document.getElementById("gh-loading");
  const error = document.getElementById("gh-error");

  try {
    const res = await fetch("https://api.github.com/users/Ahmed-Zayed-51/repos?per_page=100&sort=updated");
    if (!res.ok) throw new Error("GitHub API error");
    const repos = await res.json();

    const featured = repos
      .filter(r => !r.fork)
      .sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 2);

    grid.innerHTML = featured.map(r => `
      <a class="card linkcard" target="_blank" href="${r.html_url}">
        <div class="title">${r.name}</div>
        <div class="muted2" style="margin-top:8px; line-height:1.6;">
          ${r.description ? r.description : "Project description coming soon."}
        </div>
        <div class="chips">
          <span>${r.language ? r.language : "Data"}</span>
          <span>⭐ ${r.stargazers_count}</span>
          <span>Updated ${new Date(r.updated_at).toLocaleDateString(undefined,{year:"numeric",month:"short"})}</span>
        </div>
        <div class="muted2" style="margin-top:10px; font-weight:800; color: rgba(37,244,168,.9);">
          Open Repo ↗
        </div>
      </a>
    `).join("");

    loading.style.display = "none";
  } catch (e) {
    loading.style.display = "none";
    error.style.display = "block";
  }
}

loadGithub();

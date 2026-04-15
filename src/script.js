/* =========================
   SAFE HELPERS
========================= */

const $ = (id) => document.getElementById(id);

/* =========================
   THEME TOGGLE (FIXED + SAFE INIT)
========================= */

const toggle = $("themeToggle");

(function initTheme() {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.body.classList.add("dark");
    if (toggle) toggle.checked = true;
  }
})();

if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });
}

/* =========================
   AUTH DROPDOWN (SAFE)
========================= */

const authBtn = $("authBtn");
const authBox = $("authBox");

if (authBtn && authBox) {
  authBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    authBox.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!authBox.contains(e.target) && !authBtn.contains(e.target)) {
      authBox.classList.remove("show");
    }
  });
}

/* =========================
   REVEAL ANIMATION
========================= */

const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const trigger = window.innerHeight - 100;

  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add("active");
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* =========================
   MOCK DATA (EXPANDED)
========================= */

const jobs = [
  { title: "Frontend Developer", company: "TechCorp", tech: ["react"], remote: true, date: "2 dni temu" },
  { title: "Backend Developer", company: "InnoWave", tech: ["node", "aws"], remote: false, date: "1 dzień temu" },
  { title: "Fullstack Engineer", company: "DevStack", tech: ["react", "node"], remote: true, date: "3 dni temu" },
  { title: "Python Developer", company: "DataMind", tech: ["python", "aws"], remote: true, date: "5 dni temu" },
  { title: "Java Engineer", company: "FutureSoft", tech: ["java"], remote: false, date: "7 dni temu" },
  { title: "React Developer", company: "CodeLab", tech: ["react"], remote: true, date: "1 tydzień temu" },
  { title: "Node.js Engineer", company: "TechCorp", tech: ["node"], remote: false, date: "2 tygodnie temu" },
  { title: "DevOps Engineer", company: "CloudOps", tech: ["aws"], remote: true, date: "3 dni temu" },
  { title: "AI Engineer", company: "NeuroTech", tech: ["python"], remote: true, date: "1 dzień temu" },
  { title: "Mobile Developer", company: "AppForge", tech: ["react"], remote: false, date: "4 dni temu" }
];

/* =========================
   STATE
========================= */

let currentPage = 1;
const jobsPerPage = 4;

let searchQuery = "";
let selectedTech = new Set();
let remoteOnly = false;

/* =========================
   DOM
========================= */

const jobList = $("jobList");
const pageButtons = document.querySelectorAll(".page-btn");
const searchInput = $("searchInput");
const searchBtn = $("searchBtn");
const resetBtn = $("resetFiltersBtn");
const remoteCheckbox = $("filterRemote");
const techCheckboxes = document.querySelectorAll(".filter-tech");

/* =========================
   FILTER ENGINE
========================= */

function getFilteredJobs() {
  return jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery) ||
      job.company.toLowerCase().includes(searchQuery);

    const matchRemote = remoteOnly ? job.remote : true;

    const matchTech =
      selectedTech.size === 0 ||
      job.tech.some((t) => selectedTech.has(t));

    return matchSearch && matchRemote && matchTech;
  });
}

/* =========================
   RENDER JOBS (FIXED)
========================= */

function renderJobs() {
  if (!jobList) return;

  const filtered = getFilteredJobs();

  const totalPages = Math.max(1, Math.ceil(filtered.length / jobsPerPage));

  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;

  const pageJobs = filtered.slice(start, end);

  jobList.innerHTML = pageJobs
    .map(
      (job) => `
      <div class="job-card">
        <h3>${job.title}</h3>

        <div class="job-meta">
          ${job.company} • ${job.remote ? "Remote" : "On-site"}
        </div>

        <div class="job-tags">
          ${job.tech.map((t) => `<span class="badge">${t}</span>`).join("")}
        </div>

        <div class="job-footer">
          <span class="job-date">${job.date}</span>
          <button class="btn btn-primary">Apply</button>
        </div>
      </div>
    `
    )
    .join("");

  updatePagination(totalPages);
}

/* =========================
   PAGINATION FIXED
========================= */

function updatePagination(totalPages) {
  pageButtons.forEach((btn) => {
    const page = parseInt(btn.textContent);

    btn.classList.remove("active");

    if (!isNaN(page) && page === currentPage) {
      btn.classList.add("active");
    }
  });
}

/* =========================
   EVENTS
========================= */

pageButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("next")) {
      currentPage++;
    } else {
      currentPage = parseInt(btn.textContent);
    }

    renderJobs();
  });
});

/* SEARCH */
function applySearch() {
  searchQuery = (searchInput?.value || "").toLowerCase();
  currentPage = 1;
  renderJobs();
}

searchBtn?.addEventListener("click", applySearch);

searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") applySearch();
});

/* TECH FILTER */
techCheckboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    if (cb.checked) selectedTech.add(cb.value);
    else selectedTech.delete(cb.value);

    currentPage = 1;
    renderJobs();
  });
});

/* REMOTE */
remoteCheckbox?.addEventListener("change", () => {
  remoteOnly = remoteCheckbox.checked;
  currentPage = 1;
  renderJobs();
});

/* RESET */
resetBtn?.addEventListener("click", () => {
  searchQuery = "";
  selectedTech.clear();
  remoteOnly = false;

  if (searchInput) searchInput.value = "";
  if (remoteCheckbox) remoteCheckbox.checked = false;

  techCheckboxes.forEach((cb) => (cb.checked = false));

  currentPage = 1;
  renderJobs();
});

/* INIT */
renderJobs();

/* =========================
   COUNTERS (SMOOTH FIX)
========================= */

document.querySelectorAll(".stat-number").forEach((counter) => {
  const target = +counter.dataset.target;
  let count = 0;

  const step = target / 80;

  function update() {
    count += step;

    if (count < target) {
      counter.innerText = Math.floor(count);
      requestAnimationFrame(update);
    } else {
      counter.innerText = target;
    }
  }

  update();
});

/* =========================
   TYPING EFFECT (FIXED)
========================= */

const typedElement = $("typedText");

const words = ["droomjob",
  "beste IT-vacatures",
  "remote werk",
  "top developers"];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typedElement) return;

  const word = words[wordIndex];

  charIndex += isDeleting ? -1 : 1;

  typedElement.textContent = word.substring(0, charIndex);

  let speed = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === word.length) {
    speed = 1200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 300;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();
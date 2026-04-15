/* =========================
   THEME TOGGLE
========================= */

const toggle = document.getElementById("themeToggle");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.checked = true;
}

/* =========================
   AUTH DROPDOWN
========================= */

const authBtn = document.getElementById("authBtn");
const authBox = document.getElementById("authBox");

authBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  authBox.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!authBox.contains(e.target) && !authBtn.contains(e.target)) {
    authBox.classList.remove("show");
  }
});

/* =========================
   REVEAL ANIMATION
========================= */

const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* =========================
   MOCK DATA (FIXED)
========================= */

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    tech: ["react"],
    remote: true,
    date: "2 dni temu",
  },
  {
    title: "Backend Developer",
    company: "InnoWave",
    tech: ["node", "aws"],
    remote: false,
    date: "1 dzień temu",
  },
  {
    title: "Fullstack Engineer",
    company: "DevStack",
    tech: ["react", "node"],
    remote: true,
    date: "3 dni temu",
  },
  {
    title: "Python Developer",
    company: "DataMind",
    tech: ["python", "aws"],
    remote: true,
    date: "5 dni temu",
  },
  {
    title: "Java Engineer",
    company: "FutureSoft",
    tech: ["java"],
    remote: false,
    date: "7 dni temu",
  },
  {
    title: "React Developer",
    company: "CodeLab",
    tech: ["react"],
    remote: true,
    date: "1 tydzień temu",
  },
  {
    title: "Node.js Engineer",
    company: "TechCorp",
    tech: ["node"],
    remote: false,
    date: "2 tygodnie temu",
  },
  {
    title: "DevOps Engineer",
    company: "CloudOps",
    tech: ["aws"],
    remote: true,
    date: "3 dni temu",
  },
];

/* =========================
   STATE (KLUCZ FIXA)
========================= */

let currentPage = 1;
const jobsPerPage = 4;

let searchQuery = "";
let selectedTech = new Set();
let remoteOnly = false;

/* =========================
   DOM
========================= */

const jobList = document.getElementById("jobList");
const pageButtons = document.querySelectorAll(".page-btn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetFiltersBtn");
const remoteCheckbox = document.getElementById("filterRemote");
const techCheckboxes = document.querySelectorAll(".filter-tech");

/* =========================
   FILTER ENGINE (CORE FIX)
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
   RENDER
========================= */

function renderJobs() {
  const filtered = getFilteredJobs();

  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;

  const pageJobs = filtered.slice(start, end);

  jobList.innerHTML = "";

  pageJobs.forEach((job) => {
    const el = document.createElement("div");
    el.className = "job-card";

    el.innerHTML = `
      <h3>${job.title}</h3>
      <div class="job-meta">${job.company} • ${
      job.remote ? "Remote" : "On-site"
    }</div>

      <div class="job-tags">
        ${job.tech.map((t) => `<span class="badge">${t}</span>`).join("")}
      </div>

      <div class="job-footer">
        <span class="job-date">${job.date}</span>
        <button class="btn btn-primary">Apply</button>
      </div>
    `;

    jobList.appendChild(el);
  });

  updatePagination(filtered.length);
}

/* =========================
   PAGINATION FIX
========================= */

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / jobsPerPage);

  pageButtons.forEach((btn) => btn.classList.remove("active"));

  pageButtons.forEach((btn) => {
    const page = parseInt(btn.textContent);

    if (page === currentPage) {
      btn.classList.add("active");
    }
  });

  // clamp
  if (currentPage > totalPages) currentPage = 1;
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
  searchQuery = searchInput.value.toLowerCase();
  currentPage = 1;
  renderJobs();
}

searchBtn.addEventListener("click", applySearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") applySearch();
});

/* TECH FILTERS */
techCheckboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      selectedTech.add(cb.value);
    } else {
      selectedTech.delete(cb.value);
    }

    currentPage = 1;
    renderJobs();
  });
});

/* REMOTE */
remoteCheckbox.addEventListener("change", () => {
  remoteOnly = remoteCheckbox.checked;
  currentPage = 1;
  renderJobs();
});

/* RESET */
resetBtn.addEventListener("click", () => {
  searchQuery = "";
  selectedTech.clear();
  remoteOnly = false;

  searchInput.value = "";
  remoteCheckbox.checked = false;
  techCheckboxes.forEach((cb) => (cb.checked = false));

  currentPage = 1;
  renderJobs();
});

/* INIT */
renderJobs();

/* =========================
   STATS
========================= */

const counters = document.querySelectorAll(".stat-number");

counters.forEach((counter) => {
  const target = +counter.dataset.target;
  let count = 0;

  const update = () => {
    count += target / 60;
    if (count < target) {
      counter.innerText = Math.floor(count);
      requestAnimationFrame(update);
    } else {
      counter.innerText = target;
    }
  };

  update();
});

/* =========================
   TYPING EFFECT
========================= */

const typedElement = document.getElementById("typedText");

const words = ["pracę marzeń", "najlepsze oferty IT", "zdalną pracę", "top devów"];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const word = words[wordIndex];

  charIndex += isDeleting ? -1 : 1;

  typedElement.textContent = word.substring(0, charIndex);

  let speed = isDeleting ? 50 : 100;

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

if (typedElement) typeEffect();
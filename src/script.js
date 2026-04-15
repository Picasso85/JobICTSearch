/* =========================
   1. THEME TOGGLE
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

/* klik poza = zamknij */
document.addEventListener("click", (e) => {
  if (!authBox.contains(e.target) && !authBtn.contains(e.target)) {
    authBox.classList.remove("show");
  }
});

/* =========================
   3. REVEAL ANIMATION
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
   4. FAKE JOB DATA
========================= */

const jobs = Array.from({ length: 30 }, (_, i) => ({
  title: `Frontend Developer ${i + 1}`,
  company: "TechCorp",
  tech: ["React", "Node"],
  remote: i % 2 === 0,
  date: "2 dni temu"
}));

/* =========================
   5. PAGINATION
========================= */

const jobList = document.getElementById("jobList");
const pageButtons = document.querySelectorAll(".page-btn");

let currentPage = 1;
const jobsPerPage = 6;

/* render jobs */
function renderJobs() {
  jobList.innerHTML = "";

  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  const pageJobs = jobs.slice(start, end);

  pageJobs.forEach(job => {
    const el = document.createElement("div");
    el.className = "job-card";

    el.innerHTML = `
      <h3>${job.title}</h3>
      <div class="job-meta">${job.company} • ${job.remote ? "Remote" : "On-site"}</div>
      <div class="job-tags">
        ${job.tech.map(t => `<span class="badge">${t}</span>`).join("")}
      </div>
      <div class="job-footer">
        <span class="job-date">${job.date}</span>
        <button class="btn btn-primary">Apply</button>
      </div>
    `;

    jobList.appendChild(el);
  });
}

/* change page */
function changePage(page) {
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  if (page === "next") {
    currentPage = Math.min(currentPage + 1, totalPages);
  } else {
    currentPage = page;
  }

  /* active button */
  pageButtons.forEach(btn => btn.classList.remove("active"));

  pageButtons.forEach(btn => {
    if (btn.textContent == currentPage) {
      btn.classList.add("active");
    }
  });

  renderJobs();

  /* scroll UX 🔥 */
  window.scrollTo({
    top: document.querySelector(".jobs").offsetTop - 80,
    behavior: "smooth"
  });
}

/* events */
pageButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("next")) {
      changePage("next");
    } else {
      changePage(parseInt(btn.textContent));
    }
  });
});

/* init */
renderJobs();

/* =========================
   6. SEARCH (BONUS)
========================= */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(value)
  );

  jobList.innerHTML = "";

  filtered.forEach(job => {
    const el = document.createElement("div");
    el.className = "job-card";

    el.innerHTML = `<h3>${job.title}</h3>`;
    jobList.appendChild(el);
  });
});

/* =========================
   7. STATS COUNTER
========================= */

const counters = document.querySelectorAll(".stat-number");

counters.forEach(counter => {
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
   8. TYPING EFFECT
========================= */

const typedElement = document.getElementById("typedText");

const words = [
  "pracę marzeń",
  "najlepsze oferty IT",
  "zdalną pracę",
  "top developerów"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedElement.textContent = currentWord.substring(0, charIndex);

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 300;
  }

  setTimeout(typeEffect, speed);
}

/* start */
if (typedElement) {
  typeEffect();
}
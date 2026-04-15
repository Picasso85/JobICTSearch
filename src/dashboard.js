
/* =========================================================
   STATE (MOCK DATA)
========================================================= */
const state = {
    theme: localStorage.getItem("theme") || "light",

    stats: {
        jobs: 18,
        applications: 12,
        views: 342,
        messages: 9
    },

    applications: [
        { title: "Frontend Developer", company: "TalentStack", status: "accepted", date: "2025-01-10" },
        { title: "React Engineer", company: "WebCorp", status: "pending", date: "2025-01-12" },
        { title: "UI Developer", company: "Designify", status: "rejected", date: "2025-01-15" },
        { title: "Fullstack Dev", company: "CloudNova", status: "pending", date: "2025-01-18" },
        { title: "Next.js Engineer", company: "Vercel Labs", status: "accepted", date: "2025-01-20" },
        { title: "React Native Dev", company: "MobileX", status: "accepted", date: "2025-01-22" }
    ],

    jobs: [
        { title: "Senior Frontend Developer", location: "Remote", desc: "React + Next.js SaaS role" },
        { title: "Backend Engineer", location: "Berlin", desc: "Node.js + microservices" },
        { title: "UI/UX Designer", location: "Remote", desc: "Design systems + Figma" },
        { title: "Fullstack Dev", location: "Amsterdam", desc: "React + Node fullstack" },
        { title: "DevOps Engineer", location: "Remote", desc: "AWS + CI/CD + Docker" }
    ],

    messages: [
        { from: "bot", text: "Hej 👋 Jak mogę pomóc?" },
        { from: "me", text: "Szukam pracy frontendowej" },
        { from: "bot", text: "Mam kilka ofert dla Ciebie 👍" }
    ]
};

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavigation();
    initModal();
    initChat();
    renderApplications();
    renderJobs();
    renderChat();
    setKPIs();
    initChart();
});

/* =========================================================
   THEME
========================================================= */
function initTheme() {
    const toggle = document.getElementById("themeToggle");

    const apply = (theme) => {
        document.body.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);

        if (toggle) toggle.checked = theme === "dark";
    };

    apply(localStorage.getItem("theme") || "light");

    toggle?.addEventListener("change", () => {
        apply(toggle.checked ? "dark" : "light");
    });
}

/* =========================================================
   NAVIGATION
========================================================= */
function initNavigation() {
    const links = document.querySelectorAll(".sidebar-nav a");
    const sections = document.querySelectorAll(".dash-section");
    const title = document.getElementById("sectionTitle");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const id = link.dataset.section;

            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            sections.forEach(s => s.classList.remove("active"));
            document.getElementById(id)?.classList.add("active");

            if (title) title.textContent = link.textContent.trim();
        });
    });
}

/* =========================================================
   MODAL 
========================================================= */
function initModal() {
    const modal = document.getElementById("addJobModal");
    const openBtn = document.getElementById("showAddJobModal");
    const closeBtn = document.querySelector(".modal-close");
    const saveBtn = document.getElementById("saveJobBtn");

    if (!modal) return;

    const open = () => modal.classList.add("show");
    const close = () => modal.classList.remove("show");

    openBtn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });

    saveBtn?.addEventListener("click", () => {
        const title = document.getElementById("jobTitle").value.trim();
        const location = document.getElementById("jobLocation").value.trim();
        const desc = document.getElementById("jobDesc").value.trim();

        if (!title) return;

        state.jobs.unshift({ title, location, desc });

        renderJobs();
        close();
    });
}

/* =========================================================
   CHAT SYSTEM
========================================================= */
function initChat() {
    const input = document.getElementById("chatInput");
    const btn = document.getElementById("sendMsgBtn");
    const box = document.getElementById("chatMessages");

    const send = () => {
        const text = input.value.trim();
        if (!text) return;

        state.messages.push({ from: "me", text });

        addMsg(text, "me");

        input.value = "";

        setTimeout(() => {
            const reply = "OK 👍 Rozumiem!";
            state.messages.push({ from: "bot", text: reply });
            addMsg(reply, "bot");
        }, 700);
    };

    btn?.addEventListener("click", send);

    input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
    });
}

function renderChat() {
    const box = document.getElementById("chatMessages");
    if (!box) return;

    box.innerHTML = "";

    state.messages.forEach(msg => {
        addMsg(msg.text, msg.from);
    });
}

function addMsg(text, type) {
    const box = document.getElementById("chatMessages");

    const div = document.createElement("div");
    div.className = `chat-bubble ${type === "me" ? "me" : "bot"}`;
    div.textContent = text;

    box.appendChild(div);

    box.scrollTop = box.scrollHeight;
}

/* =========================================================
   RENDER JOBS
========================================================= */
function renderJobs() {
    const el = document.getElementById("myJobsList");
    if (!el) return;

    el.innerHTML = state.jobs.map(job => `
        <div class="panel job-card">
            <h3>${job.title}</h3>
            <p>${job.desc}</p>
            <span class="badge">${job.location}</span>
        </div>
    `).join("");
}

/* =========================================================
   RENDER APPLICATIONS
========================================================= */
function renderApplications() {
    const el = document.getElementById("applicationsList");
    if (!el) return;

    el.innerHTML = state.applications.map(app => `
        <div class="panel">
            <strong>${app.title}</strong>
            <div>${app.company}</div>
            <small>${app.status} • ${app.date}</small>
        </div>
    `).join("");
}

/* =========================================================
   KPI
========================================================= */
function setKPIs() {
    document.getElementById("statsJobs").textContent = state.stats.jobs;
    document.getElementById("statsApps").textContent = state.stats.applications;
    document.getElementById("statsViews").textContent = state.stats.views;
    document.getElementById("statsMessages").textContent = state.stats.messages;
}

/* =========================================================
   CHART (SAFE)
========================================================= */
function initChart() {
    const ctx = document.getElementById("activityChart");
    if (!ctx || typeof Chart === "undefined") return;

    if (window.chart) window.chart.destroy();

    window.chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                data: [10, 20, 15, 30, 25, 40, 35],
                borderColor: "#2563eb",
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

/* =========================================================
   LOGOUT
========================================================= */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    if (confirm("Wylogować się?")) {
        window.location.href = "../index.html";
    }
});
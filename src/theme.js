function initTheme() {
  const toggle = document.getElementById("themeToggle");

  if (state.theme === "dark") {
    document.body.classList.add("dark");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");

    state.theme = document.body.classList.contains("dark")
      ? "dark"
      : "light";

    localStorage.setItem("theme", state.theme);

    toast(`Theme: ${state.theme}`);
  });
}

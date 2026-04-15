function getInput() {
  return {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };
}

async function registerUser() {
  const { email, password } = getInput();

  await fetch("http://localhost:5000/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password, role: "CANDIDATE" })
  });

  alert("Registered!");
}

async function loginUser() {
  const { email, password } = getInput();

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert("Login failed");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
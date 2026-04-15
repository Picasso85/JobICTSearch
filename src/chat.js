/* =========================================================
   CHAT STATE
========================================================= */

const ChatState = {
  conversations: JSON.parse(localStorage.getItem("conversations")) || [
    { id: 1, name: "Rekruter Anna" },
    { id: 2, name: "AI Support" }
  ],

  messages: JSON.parse(localStorage.getItem("messages")) || [],

  activeConversation: 1,

  botTyping: false
};


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderConversations();
  renderMessages();

  const sendBtn = document.getElementById("sendMsgBtn");
  const input = document.getElementById("chatInput");

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
});


/* =========================================================
   SEND MESSAGE (USER)
========================================================= */

function sendMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();

  if (!text) return;

  addMessage("Ty", text);

  input.value = "";

  renderMessages();

  triggerBotReply(text);
}


/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(from, text) {
  ChatState.messages.push({
    id: Date.now(),
    convId: ChatState.activeConversation,
    from,
    text,
    time: new Date().toLocaleTimeString()
  });

  save();
}


/* =========================================================
   BOT REACTION (NO SPAM)
========================================================= */

function triggerBotReply(userText) {
  if (ChatState.botTyping) return;
  ChatState.botTyping = true;

  showTyping(true);

  const delay = 900 + Math.random() * 1800;

  setTimeout(() => {
    const reply = generateBotReply(userText);

    addMessage("AI Recruiter", reply);

    renderMessages();

    showTyping(false);

    ChatState.botTyping = false;
  }, delay);
}


/* =========================================================
   BOT LOGIC (SMART MOCK)
========================================================= */

function generateBotReply(text) {
  const t = text.toLowerCase();

  if (t.includes("cv")) return "Podeślij CV lub LinkedIn 👍";
  if (t.includes("wynagrodzenie")) return "Widełki zależą od doświadczenia.";
  if (t.includes("react")) return "Mamy kilka ofert React 🔥";
  if (t.includes("backend")) return "Backend Node / Java — sprawdzę dostępność.";
  if (t.includes("cześć") || t.includes("hello")) return "Cześć! Jak mogę pomóc?";

  const replies = [
    "Dzięki za wiadomość 👍",
    "Sprawdzę to i wrócę z odpowiedzią.",
    "Brzmi dobrze!",
    "Możesz doprecyzować?",
    "Zapisuję Twoją wiadomość."
  ];

  return replies[Math.floor(Math.random() * replies.length)];
}


/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages() {
  const el = document.getElementById("chatMessages");
  if (!el) return;

  const msgs = ChatState.messages.filter(
    m => m.convId === ChatState.activeConversation
  );

  if (!msgs.length) {
    el.innerHTML = `<p class="empty">Brak wiadomości</p>`;
    return;
  }

  el.innerHTML = msgs.map(m => `
    <div class="msg ${m.from === "Ty" ? "me" : "bot"}">
      <div class="msg-author">${m.from}</div>
      <div class="msg-text">${escapeHtml(m.text)}</div>
      <div class="msg-time">${m.time}</div>
    </div>
  `).join("");
}


/* =========================================================
   CONVERSATIONS
========================================================= */

function renderConversations() {
  const el = document.getElementById("conversationsList");
  if (!el) return;

  el.innerHTML = ChatState.conversations.map(c => `
    <div class="conv ${c.id === ChatState.activeConversation ? "active" : ""}"
         onclick="openConversation(${c.id})">
      💬 ${c.name}
    </div>
  `).join("");
}

window.openConversation = function(id) {
  ChatState.activeConversation = id;
  renderConversations();
  renderMessages();
};


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTyping(state) {
  let el = document.getElementById("typing");

  if (!el) {
    el = document.createElement("div");
    el.id = "typing";
    el.className = "typing";
    el.innerText = "AI pisze...";
    document.getElementById("chatMessages").appendChild(el);
  }

  el.style.display = state ? "block" : "none";
}


/* =========================================================
   SAVE
========================================================= */

function save() {
  localStorage.setItem("messages", JSON.stringify(ChatState.messages));
}


/* =========================================================
   SECURITY (HTML ESCAPE)
========================================================= */

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, (m) => {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    })[m];
  });
}
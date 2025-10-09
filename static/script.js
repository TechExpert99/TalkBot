async function sendMessage() {
  const input = document.getElementById("chat-message");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();

  if (!message) return;

  // Show user message
  const userMsgDiv = document.createElement("div");
  userMsgDiv.className = "chat-message user";
  userMsgDiv.textContent = "HI i want you to act like a talk bot you should act like a friend chatting in watsapp " + message;
  chatBox.appendChild(userMsgDiv);

  input.value = ""; // clear input
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Send to Flask backend
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    // Show bot reply
    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "chat-message bot";
    botMsgDiv.textContent = "TalkBot: " + data.reply;
    chatBox.appendChild(botMsgDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    const errorDiv = document.createElement("div");
    errorDiv.className = "chat-message error";
    errorDiv.textContent = "⚠️ Error: Could not connect to server.";
    chatBox.appendChild(errorDiv);
  }
}let lastBotReply = "";

// 🎤 Speech-to-Text (STT)
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const userMessage = event.results[0][0].transcript;
    document.getElementById("chat-message").value = userMessage;
    sendMessage();
  };

  recognition.onerror = function(event) {
    alert("Voice input error: " + event.error);
  };

  recognition.start();
}

// 🔊 Text-to-Speech (TTS)
function speakLastReply() {
  if (!lastBotReply) {
    alert("No bot reply yet!");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(lastBotReply);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// ✉️ Chat Send Function
async function sendMessage() {
  const input = document.getElementById("chat-message");
  const message = input.value;
  input.value = "";

  if (!message) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div class="user">You: ${message}</div>`;

  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  lastBotReply = data.reply;

  chatBox.innerHTML += `<div class="bot">Bot: ${lastBotReply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}


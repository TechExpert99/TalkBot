let lastBotReply = "";

// 🎤 Speech-to-Text (STT)
function startListening() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition is not supported in your browser.');
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const userMessage = event.results[0][0].transcript;
    document.getElementById("chat-message").value = userMessage;
    sendMessage();
  };

  recognition.onerror = function(event) {
    console.error("Voice input error:", event.error);
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

  // Remove HTML tags and get plain text for speech
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = lastBotReply;
  const textToSpeak = tempDiv.textContent || tempDiv.innerText || lastBotReply;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Text-to-speech is not supported in your browser.');
  }
}

// ✉️ Chat Send Function
async function sendMessage() {
  const input = document.getElementById("chat-message");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();

  if (!message) return;

  // Remove empty state if it exists
  const emptyState = chatBox.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  // Clear input
  input.value = "";

  // Show user message
  const userMsgDiv = document.createElement("div");
  userMsgDiv.className = "chat-message user";
  userMsgDiv.textContent = "You: " + message;
  chatBox.appendChild(userMsgDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Add system instruction to make bot act like a WhatsApp friend
    const systemPrompt = "You are a friendly chatbot talking like a friend on WhatsApp. Be casual, warm, and conversational.";
    const fullMessage = systemPrompt + "\n\nUser: " + message;

    // Send to Flask backend
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: fullMessage,
        session_id: "user_session_123"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Store last reply for TTS
    lastBotReply = data.reply;

    // Show bot reply with formatted code blocks
    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "chat-message bot";
    botMsgDiv.innerHTML = formatMessage(data.reply);
    chatBox.appendChild(botMsgDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error("Error:", error);
    const errorDiv = document.createElement("div");
    errorDiv.className = "chat-message error";
    errorDiv.textContent = "⚠️ Error: " + error.message;
    chatBox.appendChild(errorDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Format message with code blocks, inline code, bold, italic
function formatMessage(text) {
  let formatted = text;
  
  // Escape HTML function
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Store code blocks temporarily
  const codeBlocks = [];
  let codeBlockIndex = 0;
  
  // Extract code blocks with language: ```language\ncode```
  formatted = formatted.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, function(match, language, code) {
    const lang = language || 'plaintext';
    const placeholder = `___CODE_BLOCK_${codeBlockIndex}___`;
    codeBlocks.push({
      language: lang,
      code: code.trim()
    });
    codeBlockIndex++;
    return placeholder;
  });

  // Escape HTML in remaining text
  formatted = escapeHtml(formatted);

  // Replace placeholders with formatted code blocks
  codeBlocks.forEach((block, index) => {
    const escapedCode = escapeHtml(block.code);
    const codeBlockHtml = `<div class="code-block">
      <div class="code-header">
        <span class="code-language">${block.language.toUpperCase()}</span>
        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
      </div>
      <pre><code>${escapedCode}</code></pre>
    </div>`;
    formatted = formatted.replace(`___CODE_BLOCK_${index}___`, codeBlockHtml);
  });

  // Format inline code (`code`)
  formatted = formatted.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

  // Format bold text (**text**)
  formatted = formatted.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

  // Format italic text (*text*)
  formatted = formatted.replace(/(?<!\*)\*(?!\*)([^\*]+)\*(?!\*)/g, '<em>$1</em>');

  // Format line breaks
  formatted = formatted.replace(/\n/g, '<br>');

  return '<div class="bot-text"><strong>TalkBot:</strong> ' + formatted + '</div>';
}

// Copy code to clipboard
window.copyCode = function(button) {
  const codeBlock = button.closest('.code-block').querySelector('code');
  const code = codeBlock.textContent;

  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.innerHTML;
    button.innerHTML = '✓ Copied!';
    button.style.background = 'var(--success-color)';
    button.style.color = 'white';
    button.style.borderColor = 'var(--success-color)';

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.style.color = '';
      button.style.borderColor = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy code');
  });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById("chat-message");
  const sendBtn = document.getElementById("sendBtn");
  const voiceBtn = document.getElementById("voiceBtn");
  const speakBtn = document.getElementById("speakBtn");
  
  // Enter key to send message (Shift+Enter for new line)
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Send button click
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  // Voice button click
  if (voiceBtn) {
    voiceBtn.addEventListener('click', startListening);
  }
  
  // Speak button click
  if (speakBtn) {
    speakBtn.addEventListener('click', speakLastReply);
  }
  
  console.log('✅ TalkBot chat interface loaded successfully!');
});
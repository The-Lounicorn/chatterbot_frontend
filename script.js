const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const container = document.getElementById('messages-container');

// Render backend URL
const BACKEND_URL = 'https://chatterbot-backend-4heg.onrender.com/chatbot';

// Submit via Enter key
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

// Submit via Submit button
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const thinkingBubble = showThinking();

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userMessage })
    });

    const data = await response.json();
    container.removeChild(thinkingBubble);

    if (!response.ok || !data.response) {
      throw new Error(data.error || 'Sorry, something went wrong.');
    }

    appendMessage('bot', data.response);
  } catch (err) {
    console.error('Error:', err);
    container.removeChild(thinkingBubble);
    appendMessage('bot', err.message || 'Oops! Something went wrong.');
  }
});

// Append message with emoji avatar
function appendMessage(sender, message) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message ' + sender;

  const avatar = document.createElement('span');
  avatar.className = 'emoji-avatar';
  avatar.textContent = sender === 'user' ? '🦖' : '🤖';

  const bubble = document.createElement('p');
  bubble.textContent = message;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

// Show thinking bubble
function showThinking() {
  const thinkingWrapper = document.createElement('div');
  thinkingWrapper.className = 'message bot thinking';

  const avatar = document.createElement('span');
  avatar.className = 'emoji-avatar spinning-brain';
  avatar.textContent = '🧠';

  const bubble = document.createElement('p');
  bubble.className = 'loading-text';
  bubble.textContent = 'Thinking...';

  thinkingWrapper.appendChild(avatar);
  thinkingWrapper.appendChild(bubble);
  container.appendChild(thinkingWrapper);
  container.scrollTop = container.scrollHeight;

  return thinkingWrapper;
}

// Clear chat
document.getElementById('clear-chat').addEventListener('click', () => {
  container.innerHTML = '';
});

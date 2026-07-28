// ULTRA SMOOTH TYPEWRITER ENGINE
const fullText = "Welcome to LEBED.ai";
const typewriterContainer = document.getElementById('typewriterContainer');

const fonts = [
  "'Space Grotesk', sans-serif",
  "'JetBrains Mono', monospace",
  "'Cinzel', serif",
  "'Orbitron', sans-serif",
  "'Press Start 2P', cursive"
];

let charIndex = 0;
let isDeleting = false;
let fontIdx = 0;

function initTypewriterSpans() {
  typewriterContainer.innerHTML = '';
  for (let i = 0; i < fullText.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';

    if (fullText[i] === ' ') {
      span.innerHTML = '&nbsp;';
    } else {
      span.textContent = fullText[i];
    }

    if (i >= fullText.indexOf("LEBED.ai")) {
      span.classList.add('highlight');
    }

    span.style.fontFamily = fonts[fontIdx];
    typewriterContainer.appendChild(span);
  }
}

function smoothTypeStep() {
  const chars = typewriterContainer.querySelectorAll('.char');

  if (!isDeleting) {
    if (charIndex < fullText.length) {
      chars[charIndex].classList.remove('deleting');
      chars[charIndex].classList.add('visible');
      charIndex++;
      const delay = Math.floor(Math.random() * 30) + 65;
      setTimeout(smoothTypeStep, delay);
    } else {
      isDeleting = true;
      setTimeout(smoothTypeStep, 2400);
    }
  } else {
    if (charIndex > 0) {
      charIndex--;
      chars[charIndex].classList.remove('visible');
      chars[charIndex].classList.add('deleting');
      setTimeout(smoothTypeStep, 35);
    } else {
      isDeleting = false;
      fontIdx = (fontIdx + 1) % fonts.length;

      chars.forEach(c => {
        c.classList.remove('deleting');
        c.style.fontFamily = fonts[fontIdx];
      });

      setTimeout(smoothTypeStep, 450);
    }
  }
}

initTypewriterSpans();
setTimeout(smoothTypeStep, 400);

// Canvas Ambient Particles
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = `rgba(255, 107, 0, ${this.opacity})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}
for (let i = 0; i < 45; i++) particles.push(new Particle());
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Local Storage Profile
let userProfile = JSON.parse(localStorage.getItem('lebed_profile')) || { name: 'User', photo: null };
const sidebarAvatar = document.getElementById('sidebarAvatar');
const sidebarUserName = document.getElementById('sidebarUserName');
const modalAvatarPreview = document.getElementById('modalAvatarPreview');
const nameInput = document.getElementById('nameInput');
const avatarFileInput = document.getElementById('avatarFileInput');
let tempPhotoBase64 = null;

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

function renderUserProfile() {
  sidebarUserName.textContent = userProfile.name;
  if (userProfile.photo) {
    sidebarAvatar.style.backgroundImage = `url(${userProfile.photo})`;
    sidebarAvatar.textContent = '';
  } else {
    sidebarAvatar.style.backgroundImage = 'none';
    sidebarAvatar.textContent = getInitials(userProfile.name);
  }
}

document.getElementById('userProfileCard').addEventListener('click', () => {
  nameInput.value = userProfile.name;
  tempPhotoBase64 = userProfile.photo;
  if (tempPhotoBase64) {
    modalAvatarPreview.style.backgroundImage = `url(${tempPhotoBase64})`;
    modalAvatarPreview.textContent = '';
  } else {
    modalAvatarPreview.style.backgroundImage = 'none';
    modalAvatarPreview.textContent = getInitials(userProfile.name);
  }
  document.getElementById('profileModal').classList.add('active');
});

document.getElementById('uploadAvatarTrigger').addEventListener('click', () => avatarFileInput.click());

avatarFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      tempPhotoBase64 = evt.target.result;
      modalAvatarPreview.style.backgroundImage = `url(${tempPhotoBase64})`;
      modalAvatarPreview.textContent = '';
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  const newName = nameInput.value.trim();
  if (newName) userProfile.name = newName;
  userProfile.photo = tempPhotoBase64;
  localStorage.setItem('lebed_profile', JSON.stringify(userProfile));
  renderUserProfile();
  closeModal('profileModal');
});

// Settings Configuration
const DEFAULT_GEMINI_API_KEY = 'AQ.Ab8RN6KU9MNQKlMMbHbnK0VoeI6RroS0rdAQuLbEbSNc_2o46A';
const defaultApiConfig = {
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  key: DEFAULT_GEMINI_API_KEY,
  model: 'gemini-1.5-flash-latest'
};
let apiConfig = {
  ...defaultApiConfig,
  ...(JSON.parse(localStorage.getItem('lebed_api_config') || 'null') || {})
};
if (!apiConfig.key) {
  apiConfig.key = DEFAULT_GEMINI_API_KEY;
}

const openSettingsBtn = document.getElementById('openSettingsBtn');
if (openSettingsBtn) {
  openSettingsBtn.addEventListener('click', () => {
    document.getElementById('apiEndpointInput').value = apiConfig.endpoint;
    document.getElementById('apiKeyInput').value = apiConfig.key;
    document.getElementById('apiModelInput').value = apiConfig.model;
    document.getElementById('settingsModal').classList.add('active');
  });
}

const saveSettingsBtn = document.getElementById('saveSettingsBtn');
if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener('click', () => {
    apiConfig.endpoint = document.getElementById('apiEndpointInput').value.trim() || 'https://openrouter.ai/api/v1/chat/completions';
    apiConfig.key = document.getElementById('apiKeyInput').value.trim();
    apiConfig.model = document.getElementById('apiModelInput').value.trim() || 'openai/gpt-4o-mini';
    localStorage.setItem('lebed_api_config', JSON.stringify(apiConfig));
    closeModal('settingsModal');
  });
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// App State & Chat logic
let chats = JSON.parse(localStorage.getItem('lebed_chats')) || [];
let currentChatId = null;

const userInput = document.getElementById('userInput') || document.getElementById('input-field-id');
const sendBtn = document.getElementById('sendBtn') || document.getElementById('send-button-id');
const messageList = document.getElementById('messageList');
const heroGreeting = document.getElementById('heroGreeting');
const chatViewport = document.getElementById('chatViewport');
const historyList = document.getElementById('historyList');
const sidebar = document.querySelector('aside.sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');

// Toggle Sidebar Functionality
if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('lebed_sidebar_collapsed', sidebar.classList.contains('collapsed'));
  });
}

// Restore sidebar state
if (localStorage.getItem('lebed_sidebar_collapsed') === 'true') {
  sidebar.classList.add('collapsed');
}

function saveChats() { localStorage.setItem('lebed_chats', JSON.stringify(chats)); }

function renderSidebar() {
  historyList.innerHTML = '';
  chats.forEach(chat => {
    const item = document.createElement('div');
    item.className = `history-item ${chat.id === currentChatId ? 'active' : ''}`;
    item.onclick = () => switchChat(chat.id);

    item.innerHTML = `
      <span class="history-title">${chat.title}</span>
      <button class="item-menu-btn" onclick="toggleDropdown(event)">
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
      </button>
      <div class="dropdown-menu">
        <button class="dropdown-opt" onclick="renameChat(event, '${chat.id}')">✏️ Rename</button>
        <button class="dropdown-opt delete" onclick="deleteChat(event, '${chat.id}')">🗑️ Delete</button>
      </div>
    `;
    historyList.appendChild(item);
  });
}

function switchChat(chatId) {
  currentChatId = chatId;
  const activeChat = chats.find(c => c.id === chatId);
  messageList.innerHTML = '';

  if (activeChat && activeChat.messages.length > 0) {
    heroGreeting.style.display = 'none';
    activeChat.messages.forEach(msg => renderMessageBubble(msg));
  } else {
    heroGreeting.style.display = 'block';
  }
  renderSidebar();
}

function createNewChat() {
  const chatId = 'chat_' + Date.now();
  const now = new Date();
  const timeStr = now.toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
  const newChat = {
    id: chatId,
    title: 'New Chat',
    timestamp: timeStr,
    messages: []
  };
  chats.unshift(newChat); // أضفها في البداية
  saveChats();
  currentChatId = chatId;
  messageList.innerHTML = '';
  heroGreeting.style.display = 'block';
  if (userInput) userInput.value = '';
  renderSidebar();
}

document.getElementById('newChatBtn').addEventListener('click', createNewChat);

document.getElementById('clearAllBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all history?')) {
    chats = [];
    saveChats();
    createNewChat();
  }
});

function renderMessageBubble(msgObj) {
  const row = document.createElement('div');
  row.className = `msg-row ${msgObj.sender}`;
  row.dataset.msgId = msgObj.id;

  let avatarContent = '';
  if (msgObj.sender === 'user') {
    avatarContent = userProfile.photo
      ? `<div class="avatar" style="background-image: url(${userProfile.photo});"></div>`
      : `<div class="avatar">${getInitials(userProfile.name)}</div>`;
  } else {
    avatarContent = '<div class="avatar">AI</div>';
  }

  const timeStr = msgObj.timestamp || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  row.innerHTML = `
    ${avatarContent}
    <div class="msg-content">
      <div class="bubble">${msgObj.text}</div>
      <div class="msg-toolbar">
        <span class="timestamp">${timeStr}</span>
        <button class="tool-btn" onclick="copyMsg('${msgObj.id}')">📋 Copy</button>
        <button class="tool-btn" onclick="deleteMsg('${msgObj.id}')">🗑️</button>
      </div>
    </div>
  `;
  messageList.appendChild(row);
  chatViewport.scrollTop = chatViewport.scrollHeight;
  return row.querySelector('.bubble');
}

function addLoadingSpinner() {
  const aiMsg = document.createElement('div');
  aiMsg.className = 'msg-row ai loading';
  aiMsg.innerHTML = `
    <div class="avatar">AI</div>
    <div class="msg-content">
      <div class="bubble spinner">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messageList.appendChild(aiMsg);
  chatViewport.scrollTop = chatViewport.scrollHeight;
  return aiMsg;
}

async function handleSend() {
    const inputElement = document.getElementById('userInput') || document.querySelector('input');
    const text = inputElement?.value.trim() || '';
    if (!text) return;

    // إذا لم تكن هناك دردشة حالية، أنشئ واحدة جديدة
    if (!currentChatId) {
      createNewChat();
    }

    const userMsgObj = { id: 'msg_' + Date.now(), sender: 'user', text: text, timestamp: new Date().toLocaleTimeString() };
    renderMessageBubble(userMsgObj);
    if (inputElement) inputElement.value = '';
    
    // احفظ رسالة المستخدم في الدردشة الحالية
    const activeChat = chats.find(c => c.id === currentChatId);
    if (activeChat) {
      activeChat.messages.push(userMsgObj);
      // حدّث عنوان الدردشة من الرسالة الأولى
      if (activeChat.messages.length === 1) {
        activeChat.title = text.substring(0, 50).split('\n')[0] || 'New Chat';
      }
    }
    
    const spinnerElement = addLoadingSpinner();

    const GROQ_API_KEY = "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"; 
    const URL = "https://api.groq.com/openai/v1/chat/completions";
    
    const messages = [
        { 
            role: "system", 
            content: "You are LEBED.ai, a sophisticated AI assistant developed by Omar Mahmoudi. Always identify yourself as LEBED.ai when asked who you are." 
        },
        { role: "user", content: text }
    ];
    
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages
            })
        });
        
        const data = await response.json();
        
        // احذف spinner وأضيف الرسالة النهائية
        spinnerElement.remove();
        
        let aiText = "Error: Unable to get response";
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            aiText = data.choices[0].message.content;
        } else if (data && data.error) {
            aiText = "Error: " + data.error.message;
        }
        
        const aiMsgObj = { id: 'msg_' + (Date.now() + 1), sender: 'ai', text: aiText, timestamp: new Date().toLocaleTimeString() };
        renderMessageBubble(aiMsgObj);
        
        // احفظ رسالة الـ AI في الدردشة الحالية
        if (activeChat) {
          activeChat.messages.push(aiMsgObj);
        }
        
    } catch (err) {
        // احذف spinner وأضيف رسالة الخطأ
        spinnerElement.remove();
        const errorMsg = "Error: " + err.message;
        const aiMsgObj = { id: 'msg_' + (Date.now() + 1), sender: 'ai', text: errorMsg, timestamp: new Date().toLocaleTimeString() };
        renderMessageBubble(aiMsgObj);
        if (activeChat) {
          activeChat.messages.push(aiMsgObj);
        }
    }
    
    // احفظ كل التغييرات في localStorage
    saveChats();
    renderSidebar();
}

function copyMsg(msgId) {
  const activeChat = chats.find(c => c.id === currentChatId);
  if (!activeChat) return;
  const msg = activeChat.messages.find(m => m.id === msgId);
  if (msg) navigator.clipboard.writeText(msg.text);
}

function deleteMsg(msgId) {
  const activeChat = chats.find(c => c.id === currentChatId);
  if (!activeChat) return;
  activeChat.messages = activeChat.messages.filter(m => m.id !== msgId);
  saveChats();
  switchChat(currentChatId);
}

function toggleDropdown(e) {
  e.stopPropagation();
  document.querySelectorAll('.dropdown-menu').forEach(m => {
    if (m !== e.currentTarget.nextElementSibling) m.classList.remove('active');
  });
  e.currentTarget.nextElementSibling.classList.toggle('active');
}

function deleteChat(e, chatId) {
  e.stopPropagation();
  chats = chats.filter(c => c.id !== chatId);
  saveChats();
  if (currentChatId === chatId) createNewChat();
  else renderSidebar();
}

function renameChat(e, chatId) {
  e.stopPropagation();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;
  const newTitle = prompt('Rename chat title:', chat.title);
  if (newTitle && newTitle.trim() !== '') {
    chat.title = newTitle.trim();
    saveChats();
    renderSidebar();
  }
}

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
    e.preventDefault();
    createNewChat();
  }
  if (e.key === 'Escape') {
    closeModal('profileModal');
    closeModal('settingsModal');
  }
});

document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
});

if (sendBtn) {
  sendBtn.addEventListener('click', handleSend);
}
if (userInput) {
  userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
}

// Init
renderUserProfile();
renderSidebar();
const cmdPalette = document.getElementById('cmdPalette');
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    cmdPalette.style.display = cmdPalette.style.display === 'block' ? 'none' : 'block';
  }
});

window.addEventListener('mousemove', (e) => {
  particles.forEach(p => {
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.x -= dx * 0.02;
      p.y -= dy * 0.02;
    }
  });
});
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check saved theme
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  
  // Save preference
  if (body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.removeItem('theme');
  }
});
// Function للـ Mobile Toggle
const menuBtn = document.querySelector('.menu-toggle-btn'); // لازمك تزيد الزر هذا في الـ HTML
const sidebar = document.querySelector('.sidebar');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

import { characters, fetchRemoteCharacters, getInitialMessages, sendChatMessage } from './chat.js';
import { createMessage } from './utils.js';

const app = document.getElementById('app');

const routes = {
  '/': renderHome,
  '/home': renderHome,
  '/chat': renderChat,
  '/about': renderAbout
};

let currentCharacter = 'hijitus';
let currentCharacters = Object.values(characters);
let currentMessages = [];

function render() {
  const path = window.location.pathname || '/home';
  const view = routes[path] || renderHome;
  view();
}

function navigate(path) {
  window.history.pushState({}, '', path);
  render();
}

function createLayout(content) {
  return `
    <nav>
      <a href="/home" data-link>Inicio</a>
      <a href="/chat" data-link>Chat</a>
      <a href="/about" data-link>About</a>
    </nav>
    <main>${content}</main>
  `;
}

function renderHome() {
  app.innerHTML = createLayout(`
    <section class="hero">
      <div>
        <h1>Chatea con Hijitus</h1>
        <p>Una experiencia de conversación con el personaje más travieso de la televisión argentina, ahora en una SPA responsive.</p>
        <div class="cta-row">
          <button class="button" data-link="/chat">Empezar a hablar</button>
          <a class="button secondary" href="/about">Conocer más</a>
        </div>
      </div>
      <div class="card">
        <h2>Qué encontraras</h2>
        <ul>
          <li>Chat en tiempo real con IA</li>
          <li>Diseño mobile-first</li>
          <li>Routing SPA sin recargas</li>
        </ul>
      </div>
    </section>
  `);
  bindLinks();
}

function renderChat() {
  if (!currentMessages.length) {
    currentMessages = [...getInitialMessages(currentCharacter)];
  }

  app.innerHTML = createLayout(`
    <section class="chat-shell">
      <div class="chat-header">
        <div class="chat-profile">
          <img class="character-avatar" id="character-avatar" alt="Avatar del personaje seleccionado" />
          <div>
            <div class="profile-meta">
              <strong id="character-name">Hijitus</strong>
              <span class="profile-status">Online · listo para conversar</span>
            </div>
            <p class="character-description" id="character-description">Travieso y amable, responde con humor breve y energía clásica.</p>
          </div>
        </div>
        <div class="character-picker" id="character-picker"></div>
      </div>
      <div class="messages" id="messages"></div>
      <div class="status" id="status">Listo para conversar</div>
      <form id="chat-form" class="input-row">
        <input id="message-input" placeholder="Escribe un mensaje..." autocomplete="off" />
        <button class="button" type="submit">Enviar</button>
      </form>
    </section>
  `);

  bindLinks();
  mountChat();
}

function renderAbout() {
  app.innerHTML = createLayout(`
    <section class="about-card">
      <h1>Sobre este proyecto</h1>
      <p>Este proyecto recrea una prueba de concepto para conversar con Hijitus usando Gemini desde una función serverless de Vercel.</p>
      <p>Está pensado como una SPA responsive con navegación dinámica, historia de mensaje en sesión y componente de chat.</p>
    </section>
  `);
  bindLinks();
}

function bindLinks() {
  document.querySelectorAll('[data-link]').forEach((element) => {
    const target = element.getAttribute('data-link') || element.getAttribute('href');
    element.addEventListener('click', (event) => {
      if (target) {
        event.preventDefault();
        navigate(target);
      }
    });
  });
}

function mountChat() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');
  const pickerEl = document.getElementById('character-picker');
  const descriptionEl = document.getElementById('character-description');
  const nameEl = document.getElementById('character-name');
  const avatarEl = document.getElementById('character-avatar');
  const messagesEl = document.getElementById('messages');
  const statusEl = document.getElementById('status');

  function renderMessages() {
    const active = currentCharacters.find((item) => item.key === currentCharacter) || currentCharacters[0];
    messagesEl.innerHTML = currentMessages.map((message) => {
      const isBot = message.role !== 'user';
      return `
        <div class="message-row ${isBot ? 'incoming' : 'outgoing'}">
          ${isBot ? `<img class="message-avatar" src="${active?.avatar || ''}" alt="Avatar de ${active?.label || 'personaje'}" />` : '<div class="message-spacer"></div>'}
          <div class="message ${message.role === 'user' ? 'user' : 'bot'}">
            <div>${message.content}</div>
            <div class="message meta">${message.timestamp}</div>
          </div>
        </div>
      `;
    }).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  const renderCharacterOptions = () => {
    pickerEl.innerHTML = currentCharacters
      .map((character) => `
        <button
          type="button"
          class="character-card ${character.key === currentCharacter ? 'active' : ''}"
          data-character="${character.key}"
        >
          <div class="character-card-thumb avatar-${character.key}">
            <img class="character-card-image" src="${character.avatar || ''}" alt="${character.label}" />
          </div>
          <span>${character.label}</span>
        </button>
      `)
      .join('');

    pickerEl.querySelectorAll('.character-card').forEach((button) => {
      button.addEventListener('click', () => {
        const selected = button.getAttribute('data-character');
        if (selected) {
          currentCharacter = selected;
          updateCharacterInfo();
          currentMessages = [...getInitialMessages(currentCharacter)];
          renderMessages();
        }
      });
    });
  };

  const updateCharacterInfo = () => {
    const selected = currentCharacter;
    const active = currentCharacters.find((item) => item.key === selected) || currentCharacters[0];
    descriptionEl.textContent = active?.description || '';
    nameEl.textContent = active?.label || 'Personaje';
    avatarEl.src = active?.avatar || '';
    avatarEl.alt = `Avatar de ${active?.label || 'personaje'}`;
    avatarEl.className = `character-avatar avatar-${active?.key}`;
    input.placeholder = `Escribe un mensaje a ${active?.label || 'el personaje'}...`;
    statusEl.textContent = `Listo para conversar con ${active?.label || 'el personaje'}`;

    pickerEl.querySelectorAll('.character-card').forEach((button) => {
      button.classList.toggle('active', button.getAttribute('data-character') === selected);
    });
  };

  const loadCharacters = async () => {
    const remoteCharacters = await fetchRemoteCharacters();
    if (remoteCharacters.length) {
      currentCharacters = remoteCharacters;
      if (!currentCharacters.some((item) => item.key === currentCharacter)) {
        currentCharacter = currentCharacters[0]?.key || 'hijitus';
      }
      renderCharacterOptions();
      updateCharacterInfo();
      currentMessages = [...getInitialMessages(currentCharacter)];
      renderMessages();
    }
  };

  renderCharacterOptions();
  updateCharacterInfo();
  loadCharacters();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const active = currentCharacters.find((item) => item.key === currentCharacter) || currentCharacters[0];
    statusEl.textContent = `${active?.label || 'El personaje'} está pensando...`;
    statusEl.classList.remove('error');
    input.value = '';
    currentMessages = [...currentMessages, createMessage('user', value)];
    renderMessages();

    try {
      const updated = await sendChatMessage(currentMessages, currentCharacter);
      currentMessages = updated;
      renderMessages();
      statusEl.textContent = 'Listo para conversar';
    } catch (error) {
      statusEl.textContent = 'No se pudo enviar el mensaje';
      statusEl.classList.add('error');
      currentMessages = currentMessages.slice(0, -1);
      renderMessages();
    }
  });

  renderMessages();
}

window.addEventListener('popstate', render);
document.addEventListener('DOMContentLoaded', render);

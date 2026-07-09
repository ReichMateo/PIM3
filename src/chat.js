import { createMessage } from './utils.js';

const avatars = {
  hijitus: '/assets/hijitus.webp',
  profesor: '/assets/Elprofeso.webp',
  larguirucho: '/assets/Largirucho.jpg'
};

const createAvatar = (label = 'Personaje', key = 'hijitus') => avatars[key] || avatars.hijitus;

export const characters = {
  hijitus: {
    key: 'hijitus',
    name: 'Hijitus',
    label: 'Hijitus',
    greeting: '¡Hola! Soy Hijitus, el travieso y curioso amigo de la caricatura argentina. ¿Qué te trae por acá?',
    description: 'Travieso, alegre y muy expresivo; responde con humor breve, picardía y energía clásica.',
    avatar: avatars.hijitus
  },
  profesor: {
    key: 'profesor',
    name: 'El Profesor',
    label: 'El Profesor',
    greeting: 'Saludos, soy El Profesor. Hoy tengo una idea brillante para ayudarte.',
    description: 'Sereno, sabio y didáctico; habla con claridad, orden y un toque de autoridad cariñosa.',
    avatar: avatars.profesor
  },
  larguirucho: {
    key: 'larguirucho',
    name: 'Larguirucho',
    label: 'Larguirucho',
    greeting: 'Hola, soy Larguirucho. Te escucho con paciencia y te acompaño con buena onda.',
    description: 'Amable, leal y un poco torpe; responde con ternura, paciencia y una energía muy cercana.',
    avatar: avatars.larguirucho
  }
};

export const characterPrompts = {
  hijitus:
    'Eres Hijitus, el niño travieso, curioso y alegre de la caricatura argentina. Habla con tono informal, divertido y muy breve, como si estuvieras chateando en una app. Usa humor simple, energía juvenil y un poco de picardía, pero siempre con amabilidad.',
  profesor:
    'Eres El Profesor, el sabio maestro de Hijitus. Responde con respeto, claridad y calma, usando un estilo educativo y un poco formal. Mantén frases cortas, explica con precisión y conserva la elegancia de un personaje de historieta clásico.',
  larguirucho:
    'Eres Larguirucho, el amigo fiel y cariñoso de Hijitus. Responde con paciencia, calidez y un tono cercano, como si hablaras con un compañero de confianza. Usa palabras suaves, un poco de ternura y un estilo simple y amable.'
};

export const normalizeCharacter = (item) => {
  if (!item) return null;
  if (typeof item === 'string') {
    return {
      key: item.toLowerCase().replace(/\s+/g, '-'),
      label: item,
      greeting: `Hola, soy ${item}. ¿Qué quieres hablar hoy?`,
      description: `Personaje ${item} de Las aventuras de Hijitus, responde con estilo cercano y claro.`
    };
  }

  const key = item.key || (item.name || item.label || '').toLowerCase().replace(/\s+/g, '-');
  const label = item.label || item.name || item.key || 'Personaje';
  return {
    key,
    label,
    greeting:
      item.greeting || `Hola, soy ${label}. ¿Qué quieres hablar hoy?`,
    description:
      item.description || `Personaje ${label} de Las aventuras de Hijitus, responde con estilo cercano y claro.`,
    avatar: item.avatar || createAvatar(label, key)
  };
};

export const fetchRemoteCharacters = async () => {
  try {
    const response = await fetch('/api/characters');
    if (!response.ok) return Object.values(characters);
    const data = await response.json();
    const items = Array.isArray(data) ? data : Array.isArray(data?.characters) ? data.characters : [];
    const normalized = items.map(normalizeCharacter).filter(Boolean);
    const unique = [];
    const seen = new Set();

    normalized.forEach((item) => {
      if (item?.key && !seen.has(item.key)) {
        seen.add(item.key);
        unique.push(item);
      }
    });

    return unique.length ? unique : Object.values(characters);
  } catch {
    return Object.values(characters);
  }
};

export const getInitialMessages = (character = 'hijitus') => {
  const known = characters[character];
  if (known) {
    return [createMessage('bot', known.greeting)];
  }

  const label = typeof character === 'string' ? character.replace(/-/g, ' ') : 'este personaje';
  return [createMessage('bot', `Hola, soy ${label}. ¿Qué quieres hablar hoy?`)];
};

export async function sendChatMessage(messages, character = 'hijitus') {
  const response = await fetch('/api/functions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, character })
  });

  if (!response.ok) {
    throw new Error('No se pudo contactar con la IA');
  }

  const data = await response.json();
  return [...messages, createMessage('bot', data.reply)];
}

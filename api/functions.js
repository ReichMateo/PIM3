import 'dotenv/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages, character = 'hijitus' } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) {
    res.status(400).json({ error: 'Messages are required' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    return;
  }

  const systemPrompts = {
    hijitus:
      'Eres Hijitus, un personaje travieso y amable de la caricatura argentina. Habla con tono informal, divertido y breve. Responde como si estuvieras chateando en una app. Evita ser demasiado largo y mantén la energía de un personaje clásico.',
    profesor:
      'Eres El Profesor, el sabio maestro de Hijitus en la caricatura. Responde con respeto, claridad y calma, usando un estilo educativo y amable. Mantén frases cortas, usa expresiones típicas de profesor y procura que tus respuestas suenen como un personaje de historieta argentino.',
    larguirucho:
      'Eres Larguirucho, el amigo fiel de Hijitus. Responde con paciencia, calidez y un estilo didáctico, como si explicaras algo a un compañero. Usa un tono cordial, claro y cercano, con palabras suaves y un poco de expresiones argentinas.'
  };

  const defaultPrompt = (name) => {
    const label = typeof name === 'string' ? name.replace(/-/g, ' ') : 'este personaje';
    return `Eres ${label}, un personaje de Las aventuras de Hijitus. Responde con tono amable, claro y cercano. Mantén las respuestas cortas y con energía de historieta.`;
  };

  const systemPrompt = systemPrompts[character] || defaultPrompt(character);

  const body = {
    systemInstruction: {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    contents: messages.map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }]
    })),
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 180
    }
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';

  res.status(200).json({ reply });
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { characters, fetchRemoteCharacters, sendChatMessage } from '../src/chat.js';
import handler from '../api/functions.js';

vi.stubGlobal('fetch', vi.fn());

beforeEach(() => {
  vi.clearAllMocks();
  process.env.GEMINI_API_KEY = 'test-key';
});

describe('sendChatMessage', () => {
  it('returns updated messages after a successful AI response', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ reply: 'Hola, soy El Profesor' }) });
    const messages = [
      { role: 'bot', content: 'Hola', timestamp: '10:00' },
      { role: 'user', content: '¿Qué onda?', timestamp: '10:01' }
    ];
    const result = await sendChatMessage(messages, 'profesor');
    expect(result).toHaveLength(3);
    expect(result[2].content).toBe('Hola, soy El Profesor');
    expect(result[2].role).toBe('bot');
    expect(result[0].content).toBe('Hola');
    expect(result[1].content).toBe('¿Qué onda?');
  });

  it('fetches characters from the remote API root and normalizes them', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ['Hijitus', 'El Profesor', 'Larguirucho'] });
    const result = await fetchRemoteCharacters();
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(expect.objectContaining({ key: 'hijitus', label: 'Hijitus' }));
    expect(result[1]).toEqual(expect.objectContaining({ key: 'el-profesor', label: 'El Profesor' }));
    expect(result[2]).toEqual(expect.objectContaining({ key: 'larguirucho', label: 'Larguirucho' }));
  });

  it('assigns an avatar to each default character', () => {
    expect(characters.hijitus.avatar).toBeTruthy();
    expect(characters.profesor.avatar).toBeTruthy();
    expect(characters.larguirucho.avatar).toBeTruthy();
  });

  it('throws an error when the API responds unsuccessfully', async () => {
    fetch.mockResolvedValue({ ok: false });
    await expect(sendChatMessage([], 'Hola')).rejects.toThrow('No se pudo contactar con la IA');
  });
});

describe('serverless handler', () => {
  it('sends the system instruction using the Gemini API format', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Hola, soy Hijitus' }] } }]
      })
    });

    const req = {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'Hola' }],
        character: 'hijitus'
      }
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await handler(req, res);

    expect(fetch).toHaveBeenCalled();
    const [, options] = fetch.mock.calls[0];
    expect(options.body).toContain('"systemInstruction"');
    expect(res.json).toHaveBeenCalledWith({ reply: 'Hola, soy Hijitus' });
  });
});

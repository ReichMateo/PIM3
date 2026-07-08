import { describe, it, expect } from 'vitest';
import { createMessage, parseApiResponse, buildHistory } from '../src/utils.js';

describe('createMessage', () => {
  it('creates a message with role content and timestamp', () => {
    const message = createMessage('user', 'Hola');
    expect(message.role).toBe('user');
    expect(message.content).toBe('Hola');
    expect(message.timestamp).toBeTruthy();
  });
});

describe('parseApiResponse', () => {
  it('returns plain text string directly', () => {
    expect(parseApiResponse('Hola')).toBe('Hola');
  });

  it('extracts text from Gemini-style response objects', () => {
    const raw = {
      candidates: [{ content: { parts: [{ text: 'Respuesta de prueba' }] } }]
    };
    expect(parseApiResponse(raw)).toBe('Respuesta de prueba');
  });
});

describe('buildHistory', () => {
  it('maps messages into Gemini-compatible history', () => {
    const messages = [createMessage('user', 'Hola'), createMessage('bot', 'Qué tal')];
    const history = buildHistory(messages);
    expect(history).toHaveLength(2);
    expect(history[0]).toEqual({ role: 'user', parts: [{ text: 'Hola' }] });
  });
});

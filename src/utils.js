export const createMessage = (role, content) => ({ role, content, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });

export const parseApiResponse = (raw) => {
  if (!raw) return '';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') {
    if (raw.candidates?.[0]?.content?.parts?.[0]?.text) return raw.candidates[0].content.parts[0].text;
    if (raw.text) return raw.text;
  }
  return '';
};

export const buildHistory = (messages) => messages.map(({ role, content }) => ({ role, parts: [{ text: content }] }));

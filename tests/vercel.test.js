import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Vercel routing config', () => {
  it('keeps asset and API requests out of the SPA fallback rewrite', () => {
    const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
    const rewrites = config.rewrites || [];

    expect(rewrites).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: '/api/(.*)', destination: '/api/$1' }),
        expect.objectContaining({ source: '/assets/(.*)', destination: '/assets/$1' })
      ])
    );
  });
});

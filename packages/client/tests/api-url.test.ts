import { describe, expect, it } from 'vitest';
import { resolveApiUrl } from '../src/config/api';

describe('resolveApiUrl', () => {
  it('usa la URL configurada y elimina las barras finales', () => {
    expect(resolveApiUrl(' https://api.example.com/ ')).toBe(
      'https://api.example.com',
    );
  });

  it('resuelve el puerto del API del mismo Codespace a 3000', () => {
    expect(
      resolveApiUrl(
        '',
        'https://bug-free-space-potato-x56qg7gq46rw3vp6g-5173.app.github.dev',
      ),
    ).toBe(
      'https://bug-free-space-potato-x56qg7gq46rw3vp6g-3000.app.github.dev',
    );
  });

  it('conserva localhost como fallback para desarrollo local', () => {
    expect(resolveApiUrl('', 'http://localhost:5173')).toBe(
      'http://localhost:3000',
    );
  });
});

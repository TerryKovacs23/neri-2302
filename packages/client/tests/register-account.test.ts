/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegisteredUser, RegisterUserRequest } from '@app/shared';
import { registerAccount } from '../src/modules/auth/services/index';

const request: RegisterUserRequest = {
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  password: 'secure-pass',
  confirmPassword: 'secure-pass',
};

const registeredUser: RegisteredUser = {
  id: 'user-1',
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  balance: 0,
  createdAt: '2026-10-01T12:00:00.000Z',
};

function mockResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe('registerAccount', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('envía los datos al endpoint y persiste el usuario tras el éxito', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ user: registeredUser }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await registerAccount(request);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }),
    );
    expect(result.user).toEqual(registeredUser);
    expect(JSON.parse(localStorage.getItem('slow-rush.users') ?? '[]')).toEqual([
      { ...registeredUser, password: request.password },
    ]);
  });

  it('muestra el error del servidor y no persiste un registro rechazado', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse({ message: 'El correo ya está en uso.' }, false),
      ),
    );

    await expect(registerAccount(request)).rejects.toThrow(
      'El correo ya está en uso.',
    );
    expect(localStorage.getItem('slow-rush.users')).toBeNull();
  });

  it('evita llamar al servidor cuando el correo ya está registrado localmente', async () => {
    localStorage.setItem(
      'slow-rush.users',
      JSON.stringify([{ ...registeredUser, password: request.password }]),
    );
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(registerAccount({ ...request, email: ' ANA@EXAMPLE.COM ' })).rejects.toThrow(
      'Ya existe una cuenta con ese correo electrónico.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('convierte errores de red en un mensaje entendible', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));

    await expect(registerAccount(request)).rejects.toThrow(
      'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    );
    expect(localStorage.getItem('slow-rush.users')).toBeNull();
  });

  it('migra las cuentas guardadas previamente con la marca Neri', async () => {
    localStorage.setItem(
      'neri.users',
      JSON.stringify([{ ...registeredUser, password: request.password }]),
    );
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(registerAccount(request)).rejects.toThrow(
      'Ya existe una cuenta con ese correo electrónico.',
    );
    expect(localStorage.getItem('slow-rush.users')).toBe(
      localStorage.getItem('neri.users'),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
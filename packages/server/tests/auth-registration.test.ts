import { describe, expect, it } from 'vitest';
import {
  RegistrationError,
  registerUser,
} from '../src/modules/auth/services/index.js';

describe('registerUser', () => {
  it('normaliza nombre y correo, y crea al usuario con saldo cero', () => {
    const user = registerUser({
      fullName: '  Ana Pérez  ',
      email: ' ANA@Example.COM ',
      password: 'secure-pass',
      confirmPassword: 'secure-pass',
    });

    expect(user).toMatchObject({
      fullName: 'Ana Pérez',
      email: 'ana@example.com',
      balance: 0,
    });
    expect(user.id).toBeTruthy();
    expect(Number.isNaN(Date.parse(user.createdAt))).toBe(false);
    expect(user).not.toHaveProperty('password');
  });

  it.each([
    [null, 'Los datos del registro no son válidos.'],
    [{}, 'Completa todos los campos obligatorios.'],
    [
      {
        fullName: 'Ana',
        email: 'ana@example.com',
        password: 'secure-pass',
        confirmPassword: '',
      },
      'Completa todos los campos obligatorios.',
    ],
    [
      {
        fullName: 'Ana',
        email: 'correo-inválido',
        password: 'secure-pass',
        confirmPassword: 'secure-pass',
      },
      'Ingresa un correo electrónico válido.',
    ],
    [
      {
        fullName: 'Ana',
        email: 'ana@example.com',
        password: 'secure-pass',
        confirmPassword: 'different-pass',
      },
      'Las contraseñas no coinciden.',
    ],
  ])('rechaza entrada inválida: %s', (input, message) => {
    expect(() => registerUser(input)).toThrowError(
      new RegistrationError(message),
    );
  });
});
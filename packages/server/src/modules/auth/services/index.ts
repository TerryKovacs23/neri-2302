import { randomUUID } from 'node:crypto';
import type { RegisterUserRequest, RegisteredUser } from '@app/shared';

export class RegistrationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'RegistrationError';
  }
}

export function registerUser(input: unknown): RegisteredUser {
  if (typeof input !== 'object' || input === null) {
    throw new RegistrationError('Los datos del registro no son válidos.');
  }

  const request = input as Partial<RegisterUserRequest>;
  const fullName = request.fullName?.trim();
  const email = request.email?.trim();
  const password = request.password;
  const confirmPassword = request.confirmPassword;

  if (
    typeof request.fullName !== 'string' ||
    typeof request.email !== 'string' ||
    typeof request.password !== 'string' ||
    typeof request.confirmPassword !== 'string' ||
    !fullName ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    throw new RegistrationError('Completa todos los campos obligatorios.');
  }

  const normalizedEmail = email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new RegistrationError('Ingresa un correo electrónico válido.');
  }

  if (password !== confirmPassword) {
    throw new RegistrationError('Las contraseñas no coinciden.');
  }

  return {
    id: randomUUID(),
    fullName,
    email: normalizedEmail,
    balance: 0,
    createdAt: new Date().toISOString(),
  };
}

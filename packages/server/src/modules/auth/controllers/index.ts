import type { Request, Response } from 'express';
import { RegistrationError, registerUser } from '../services/index.js';

export function createUser(request: Request, response: Response): void {
  try {
    const user = registerUser(request.body);
    response.status(201).json({ user });
  } catch (error) {
    if (error instanceof RegistrationError) {
      response.status(error.statusCode).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: 'No fue posible crear la cuenta.' });
  }
}

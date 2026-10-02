import type {
  ApiErrorResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from '@app/shared';
import { resolveApiUrl } from '../../../config/api';
import { emailIsRegistered, saveRegisteredUser } from '../../../services/storage/index';

export async function registerAccount(
  request: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  if (emailIsRegistered(request.email)) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.');
  }

  let response: Response;
  try {
    response = await fetch(`${resolveApiUrl()}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Inténtalo de nuevo.');
  }

  const result = (await response.json()) as RegisterUserResponse | ApiErrorResponse;
  if (!response.ok) {
    throw new Error('message' in result ? result.message : 'No fue posible crear la cuenta.');
  }

  if (!('user' in result)) {
    throw new Error('El servidor devolvió una respuesta inválida.');
  }

  saveRegisteredUser(result.user, request.password);
  return result;
}

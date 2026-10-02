import type { LoginUserRequest, LoginUserResponse } from '@app/shared';
import { authenticateStoredUser } from '../../../services/storage/index';

export async function loginAccount(
	request: LoginUserRequest,
): Promise<LoginUserResponse> {
	const user = authenticateStoredUser(request.email, request.password);
	if (!user) {
		throw new Error('El correo electrónico o la contraseña no son correctos.');
	}

	return { user };
}

/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest';
import type { RegisteredUser, StoredUser } from '@app/shared';
import { loginAccount } from '../src/modules/auth/services/login';

const storedUser: StoredUser = {
	id: 'user-1',
	fullName: 'Ana Pérez',
	email: 'ana@example.com',
	password: 'secure-pass',
	balance: 0,
	createdAt: '2026-10-01T12:00:00.000Z',
};

describe('loginAccount', () => {
	beforeEach(() => {
		localStorage.clear();
		localStorage.setItem('slow-rush.users', JSON.stringify([storedUser]));
	});

	it('autentica las credenciales locales y devuelve el perfil sin la contraseña', async () => {
		const result = await loginAccount({
			email: ' ANA@EXAMPLE.COM ',
			password: 'secure-pass',
		});

		expect(result.user).toEqual<RegisteredUser>({
			id: storedUser.id,
			fullName: storedUser.fullName,
			email: storedUser.email,
			balance: storedUser.balance,
			createdAt: storedUser.createdAt,
		});
		expect(result.user).not.toHaveProperty('password');
	});

	it.each([
		['missing@example.com', 'secure-pass'],
		['ana@example.com', 'wrong-password'],
	])('rechaza credenciales inválidas', async (email, password) => {
		await expect(loginAccount({ email, password })).rejects.toThrow(
			'El correo electrónico o la contraseña no son correctos.',
		);
	});
});

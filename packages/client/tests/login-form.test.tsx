/** @vitest-environment jsdom */

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegisteredUser } from '@app/shared';
import LoginForm from '../src/modules/auth/components/LoginForm';
import { loginAccount } from '../src/modules/auth/services/login';

vi.mock('../src/modules/auth/services/login', () => ({
	loginAccount: vi.fn(),
}));

const registeredUser: RegisteredUser = {
	id: 'user-1',
	fullName: 'Ana Pérez',
	email: 'ana@example.com',
	balance: 0,
	createdAt: '2026-10-01T12:00:00.000Z',
};

describe('LoginForm', () => {
	const loginAccountMock = vi.mocked(loginAccount);
	const onLogin = vi.fn();
	const onRegister = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		render(<LoginForm onLogin={onLogin} onRegister={onRegister} />);
	});

	it('solicita correo y contraseña obligatorios para Slow Rush', () => {
		expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Correo electrónico' })).toBeRequired();
		expect(screen.getByLabelText(/^Contraseña/)).toBeRequired();
		expect(screen.getByRole('button', { name: 'Entrar a Slow Rush' })).toBeInTheDocument();
	});

	it('entrega el perfil autenticado para navegar al dashboard', async () => {
		loginAccountMock.mockResolvedValue({ user: registeredUser });
		fireEvent.change(screen.getByRole('textbox', { name: 'Correo electrónico' }), {
			target: { value: 'ana@example.com' },
		});
		fireEvent.change(screen.getByLabelText(/^Contraseña/), {
			target: { value: 'secure-pass' },
		});

		fireEvent.click(screen.getByRole('button', { name: 'Entrar a Slow Rush' }));

		await vi.waitFor(() => expect(onLogin).toHaveBeenCalledWith(registeredUser));
	});

	it('presenta un error de credenciales sin invocar el callback de acceso', async () => {
		loginAccountMock.mockRejectedValue(
			new Error('El correo electrónico o la contraseña no son correctos.'),
		);
		fireEvent.change(screen.getByRole('textbox', { name: 'Correo electrónico' }), {
			target: { value: 'ana@example.com' },
		});
		fireEvent.change(screen.getByLabelText(/^Contraseña/), {
			target: { value: 'wrong-password' },
		});

		fireEvent.click(screen.getByRole('button', { name: 'Entrar a Slow Rush' }));

		expect(await screen.findByRole('alert')).toHaveTextContent(
			'El correo electrónico o la contraseña no son correctos.',
		);
		expect(onLogin).not.toHaveBeenCalled();
	});
});

/** @vitest-environment jsdom */

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import type { RegisteredUser } from '@app/shared';
import App from '../src/App';
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

describe('App login flow', () => {
	it('muestra el dashboard Slow Rush después de una autenticación correcta', async () => {
		vi.mocked(loginAccount).mockResolvedValue({ user: registeredUser });
		render(<App />);
		fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
		fireEvent.change(screen.getByRole('textbox', { name: 'Correo electrónico' }), {
			target: { value: registeredUser.email },
		});
		fireEvent.change(screen.getByLabelText(/^Contraseña/), {
			target: { value: 'secure-pass' },
		});

		fireEvent.click(screen.getByRole('button', { name: 'Entrar a Slow Rush' }));

		expect(
			await screen.findByRole('heading', { name: '¡Hola, Ana Pérez!' }),
		).toBeInTheDocument();
		expect(screen.getByText('Saldo para apuestas')).toBeInTheDocument();
		expect(screen.getByText('$0.00')).toBeInTheDocument();
	});
});

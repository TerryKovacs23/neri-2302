/** @vitest-environment jsdom */

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
	beforeEach(() => {
		localStorage.clear();
		window.history.replaceState({}, '', '/');
		vi.clearAllMocks();
	});

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
		expect(JSON.parse(localStorage.getItem('slow-rush.session') ?? '{}')).toEqual({
			user: registeredUser,
		});
	});

	it('redirige a login cuando se abre dashboard sin sesión', () => {
		window.history.replaceState({}, '', '/dashboard');

		render(<App />);

		expect(
			screen.getByRole('heading', { name: 'Inicia sesión' }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole('heading', { name: '¡Hola, Ana Pérez!' }),
		).not.toBeInTheDocument();
	});

	it('restaura el usuario y el saldo desde LocalStorage después de recargar', () => {
		localStorage.setItem(
			'slow-rush.session',
			JSON.stringify({ user: registeredUser }),
		);
		window.history.replaceState({}, '', '/dashboard');

		render(<App />);

		expect(
			screen.getByRole('heading', { name: '¡Hola, Ana Pérez!' }),
		).toBeInTheDocument();
		expect(screen.getByText('$0.00')).toBeInTheDocument();
	});

	it('rechaza una sesión persistida con perfil inválido y protege el dashboard', () => {
		localStorage.setItem('slow-rush.session', JSON.stringify({ user: { id: 'x' } }));
		window.history.replaceState({}, '', '/dashboard');

		render(<App />);

		expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument();
		expect(localStorage.getItem('slow-rush.session')).toBeNull();
	});

	it('cierra la sesión y redirige a login al pulsar Cerrar sesión', async () => {
		localStorage.setItem(
			'slow-rush.session',
			JSON.stringify({ user: registeredUser }),
		);
		window.history.replaceState({}, '', '/dashboard');

		render(<App />);
		fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

		expect(
			await screen.findByRole('heading', { name: 'Inicia sesión' }),
		).toBeInTheDocument();
		expect(localStorage.getItem('slow-rush.session')).toBeNull();
		expect(window.location.pathname).toBe('/login');
	});

	it('bloquea el dashboard si se intenta volver a su ruta después del logout', async () => {
		localStorage.setItem(
			'slow-rush.session',
			JSON.stringify({ user: registeredUser }),
		);
		window.history.replaceState({}, '', '/dashboard');

		render(<App />);
		fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
		await screen.findByRole('heading', { name: 'Inicia sesión' });

		window.history.pushState({}, '', '/dashboard');
		window.dispatchEvent(new PopStateEvent('popstate'));

		expect(
			await screen.findByRole('heading', { name: 'Inicia sesión' }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole('heading', { name: '¡Hola, Ana Pérez!' }),
		).not.toBeInTheDocument();
	});
});

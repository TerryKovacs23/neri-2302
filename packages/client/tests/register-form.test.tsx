/** @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegisteredUser, RegisterUserRequest } from '@app/shared';
import RegisterForm from '../src/modules/auth/components/index';
import { registerAccount } from '../src/modules/auth/services/index';

vi.mock('../src/modules/auth/services/index', () => ({
  registerAccount: vi.fn(),
}));

const registeredUser: RegisteredUser = {
  id: 'user-1',
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  balance: 0,
  createdAt: '2026-10-01T12:00:00.000Z',
};

function completeForm(password = 'secure-pass', confirmation = password) {
  fireEvent.change(screen.getByRole('textbox', { name: 'Nombre completo' }), {
    target: { value: 'Ana Pérez' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Correo electrónico' }), {
    target: { value: 'ana@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^Contraseña/), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText(/^Confirmar contraseña/), {
    target: { value: confirmation },
  });
}

describe('RegisterForm', () => {
  const registerAccountMock = vi.mocked(registerAccount);

  beforeEach(() => {
    vi.clearAllMocks();
    render(<RegisterForm />);
  });

  it('solicita cuatro campos obligatorios y no permite adjuntar archivos', () => {
    const form = screen.getByRole('heading', { name: 'Crea tu cuenta' }).closest('section');
    const inputs = form?.querySelectorAll('input');

    expect(inputs).toHaveLength(4);
    expect([...inputs ?? []].every((input) => input.required)).toBe(true);
    expect(form?.querySelector('input[type="file"]')).not.toBeInTheDocument();
  });

  it('presenta el registro como una cuenta de apuestas de carreras de caracoles', () => {
    expect(screen.getByText('Slow Rush · carreras de caracoles')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Regístrate para seguir las carreras y gestionar tu saldo de apuestas.',
      ),
    ).toBeInTheDocument();
  });

  it('rechaza contraseñas distintas sin invocar el servicio', async () => {
    completeForm('secure-pass', 'different-pass');
    fireEvent.submit(screen.getByRole('button', { name: 'Crear cuenta' }).closest('form')!);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Las contraseñas no coinciden.',
    );
    expect(registerAccountMock).not.toHaveBeenCalled();
  });

  it('muestra confirmación y saldo cero tras un registro exitoso', async () => {
    registerAccountMock.mockResolvedValue({ user: registeredUser });
    completeForm();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() =>
      expect(registerAccountMock).toHaveBeenCalledWith<[
        RegisterUserRequest
      ]>({
        fullName: 'Ana Pérez',
        email: 'ana@example.com',
        password: 'secure-pass',
        confirmPassword: 'secure-pass',
      }),
    );
    expect(
      await screen.findByRole('heading', {
        name: '¡Bienvenido a Slow Rush, Ana Pérez!',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Saldo para apuestas')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('presenta los errores devueltos por el servicio', async () => {
    registerAccountMock.mockRejectedValue(new Error('Correo no disponible.'));
    completeForm();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Correo no disponible.',
    );
  });
});
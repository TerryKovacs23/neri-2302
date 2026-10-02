import { useState, type FormEvent } from 'react';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { LoginUserRequest, RegisteredUser } from '@app/shared';
import { loginAccount } from '../services/login';

interface LoginFormProps {
	onLogin: (user: RegisteredUser) => void;
	onRegister: () => void;
}

export default function LoginForm({ onLogin, onRegister }: LoginFormProps) {
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError('');
		const formData = new FormData(event.currentTarget);
		const request: LoginUserRequest = {
			email: String(formData.get('email') ?? ''),
			password: String(formData.get('password') ?? ''),
		};

		setIsSubmitting(true);
		try {
			const response = await loginAccount(request);
			onLogin(response.user);
		} catch (loginError) {
			setError(
				loginError instanceof Error
					? loginError.message
					: 'No fue posible iniciar sesión.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section className="auth-panel">
			<div className="brand-mark" aria-hidden="true">SR</div>
			<Typography component="p" className="eyebrow">
				Slow Rush · carreras de caracoles
			</Typography>
			<Typography component="h1" className="form-title">Inicia sesión</Typography>
			<Typography component="p" className="form-description">
				Vuelve a la pista y descubre qué caracol lidera la carrera.
			</Typography>

			<form className="register-form" onSubmit={handleSubmit}>
				<TextField
					name="email"
					label="Correo electrónico"
					type="email"
					autoComplete="email"
					required
					fullWidth
				/>
				<TextField
					name="password"
					label="Contraseña"
					type="password"
					autoComplete="current-password"
					required
					fullWidth
				/>
				{error && <Alert severity="error" className="form-alert">{error}</Alert>}
				<Button
					type="submit"
					variant="contained"
					size="large"
					fullWidth
					disabled={isSubmitting}
					startIcon={<LoginOutlinedIcon />}
				>
					{isSubmitting ? 'Iniciando sesión...' : 'Entrar a Slow Rush'}
				</Button>
			</form>
			<Typography component="p" className="privacy-note">
				¿Aún no tienes una cuenta?{' '}
				<Button variant="text" onClick={onRegister}>Crear cuenta</Button>
			</Typography>
		</section>
	);
}

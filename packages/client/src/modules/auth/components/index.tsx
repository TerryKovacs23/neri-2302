import { useState, type FormEvent } from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { RegisteredUser, RegisterUserRequest } from '@app/shared';
import { registerAccount } from '../services/index';

interface RegisterFormProps {
  onLogin: () => void;
}

export default function RegisterForm({ onLogin }: RegisterFormProps) {
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState<RegisteredUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const request: RegisterUserRequest = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };

    if (request.password !== request.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerAccount(request);
      setCreatedUser(response.user);
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : 'No fue posible crear la cuenta.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdUser) {
    return (
      <section className="auth-panel" aria-live="polite">
        <div className="brand-mark" aria-hidden="true">SR</div>
        <Typography component="p" className="eyebrow">Registro completado</Typography>
        <Typography component="h1" className="form-title">
          ¡Bienvenido a Slow Rush, {createdUser.fullName}!
        </Typography>
        <Alert severity="success" className="form-alert">
          Tu cuenta está lista para disfrutar las carreras. Ya puedes iniciar sesión con {createdUser.email}.
        </Alert>
        <div className="balance-summary">
          <AccountBalanceWalletOutlinedIcon />
          <div>
            <Typography component="p" className="balance-label">Saldo para apuestas</Typography>
            <Typography component="p" className="balance-value">
              {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'narrowSymbol',
              }).format(createdUser.balance)}
            </Typography>
          </div>
        </div>
        <Button variant="contained" fullWidth onClick={onLogin}>
          Iniciar sesión
        </Button>
      </section>
    );
  }

  return (
    <section className="auth-panel">
      <div className="brand-mark" aria-hidden="true">SR</div>
      <Typography component="p" className="eyebrow">Slow Rush · carreras de caracoles</Typography>
      <Typography component="h1" className="form-title">Crea tu cuenta</Typography>
      <Typography component="p" className="form-description">
        Regístrate para seguir las carreras y gestionar tu saldo de apuestas.
      </Typography>

      <form className="register-form" onSubmit={handleSubmit}>
        <TextField
          name="fullName"
          label="Nombre completo"
          autoComplete="name"
          required
          fullWidth
        />
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
          autoComplete="new-password"
          required
          fullWidth
        />
        <TextField
          name="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
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
          startIcon={<PersonAddAlt1OutlinedIcon />}
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
      <Typography component="p" className="privacy-note">
        Tu perfil y saldo se guardarán en este dispositivo.{' '}
        ¿Ya tienes cuenta?{' '}
        <Button variant="text" onClick={onLogin}>Iniciar sesión</Button>
      </Typography>
    </section>
  );
}

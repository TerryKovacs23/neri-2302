import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { RegisteredUser } from '@app/shared';

interface DashboardProps {
	user: RegisteredUser;
}

export default function Dashboard({ user }: DashboardProps) {
	const balance = new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'USD',
		currencyDisplay: 'narrowSymbol',
	}).format(user.balance);

	return (
		<section className="auth-panel dashboard-panel">
			<div className="dashboard-heading">
				<div>
					<Typography component="p" className="eyebrow">Slow Rush · pista principal</Typography>
					<Typography component="h1" className="form-title">
						¡Hola, {user.fullName}!
					</Typography>
				</div>
			</div>
			<Typography component="p" className="form-description">
				Tu próxima carrera empieza despacio. ¿Listo para elegir a tu favorito?
			</Typography>
			<Card variant="outlined" className="dashboard-balance">
				<CardContent>
					<AccountBalanceWalletOutlinedIcon color="primary" />
					<Typography component="p" className="balance-label">
						Saldo para apuestas
					</Typography>
					<Typography component="p" className="balance-value">
						{balance}
					</Typography>
				</CardContent>
			</Card>
		</section>
	);
}

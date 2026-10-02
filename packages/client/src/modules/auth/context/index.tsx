import {
	createContext,
	useContext,
	useMemo,
	useState,
	type PropsWithChildren,
} from 'react';
import type { RegisteredUser } from '@app/shared';
import {
	clearActiveSession,
	readActiveSession,
	saveActiveSession,
} from '../../../services/storage/index';

interface AuthContextValue {
	user: RegisteredUser | null;
	signIn: (user: RegisteredUser) => void;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<RegisteredUser | null>(
		() => readActiveSession()?.user ?? null,
	);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			signIn: (authenticatedUser) => {
				saveActiveSession(authenticatedUser);
				setUser(authenticatedUser);
			},
			signOut: () => {
				clearActiveSession();
				setUser(null);
			},
		}),
		[user],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe usarse dentro de AuthProvider.');
	}

	return context;
}

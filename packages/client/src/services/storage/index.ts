import type { AuthSession, RegisteredUser, StoredUser } from '@app/shared';

const USERS_STORAGE_KEY = 'slow-rush.users';
const LEGACY_USERS_STORAGE_KEY = 'neri.users';
const SESSION_STORAGE_KEY = 'slow-rush.session';

function isAuthSession(value: unknown): value is AuthSession {
	if (typeof value !== 'object' || value === null || !('user' in value)) {
		return false;
	}

	const user = value.user;
	return (
		typeof user === 'object' &&
		user !== null &&
		'id' in user &&
		typeof user.id === 'string' &&
		'fullName' in user &&
		typeof user.fullName === 'string' &&
		'email' in user &&
		typeof user.email === 'string' &&
		'balance' in user &&
		typeof user.balance === 'number' &&
		'createdAt' in user &&
		typeof user.createdAt === 'string'
	);
}

function readUsers(): StoredUser[] {
	try {
		const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
		if (storedUsers) {
			return JSON.parse(storedUsers) as StoredUser[];
		}

		const legacyUsers = localStorage.getItem(LEGACY_USERS_STORAGE_KEY);
		if (!legacyUsers) {
			return [];
		}

		const users = JSON.parse(legacyUsers) as StoredUser[];
		localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
		return users;
	} catch {
		return [];
	}
}

export function emailIsRegistered(email: string): boolean {
	const normalizedEmail = email.trim().toLowerCase();
	return readUsers().some((user) => user.email === normalizedEmail);
}

export function saveRegisteredUser(user: RegisteredUser, password: string): void {
	const storedUser: StoredUser = { ...user, password };
	const users = readUsers();
	localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, storedUser]));
}

export function authenticateStoredUser(
	email: string,
	password: string,
): RegisteredUser | null {
	const normalizedEmail = email.trim().toLowerCase();
	const user = readUsers().find(
		(storedUser) =>
			storedUser.email === normalizedEmail && storedUser.password === password,
	);

	if (!user) {
		return null;
	}

	return {
		id: user.id,
		fullName: user.fullName,
		email: user.email,
		balance: user.balance,
		createdAt: user.createdAt,
	};
}

export function readActiveSession(): AuthSession | null {
	const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
	if (!storedSession) {
		return null;
	}

	try {
		const session: unknown = JSON.parse(storedSession);
		if (isAuthSession(session)) {
			return session;
		}
	} catch {
		localStorage.removeItem(SESSION_STORAGE_KEY);
		return null;
	}

	localStorage.removeItem(SESSION_STORAGE_KEY);
	return null;
}

export function saveActiveSession(user: RegisteredUser): void {
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user } satisfies AuthSession));
}

export function clearActiveSession(): void {
	localStorage.removeItem(SESSION_STORAGE_KEY);
}

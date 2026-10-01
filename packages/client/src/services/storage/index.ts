import type { RegisteredUser, StoredUser } from '@app/shared';

const USERS_STORAGE_KEY = 'slow-rush.users';
const LEGACY_USERS_STORAGE_KEY = 'neri.users';

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

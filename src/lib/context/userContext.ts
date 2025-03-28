import { writable, type Writable } from 'svelte/store';
import { setContext, getContext, hasContext } from 'svelte';
import type { User } from '@lib/utils/types';

const USER_CONTEXT_KEY = 'user-context';

// Fungsi untuk membuat context user
export const createUserContext = (initialUser: User | null = null) => {
	const user: Writable<User | null> = writable(initialUser);
	setContext(USER_CONTEXT_KEY, user);
	return user;
};

// Fungsi untuk mendapatkan context user
export function useSession(): Writable<User> {
	return getContext(USER_CONTEXT_KEY);
}

const ONLINE_CONTEXT_KEY = 'online-context';
export const createUserOnline = () => {
	if (hasContext(ONLINE_CONTEXT_KEY)) {
		return getContext<{
			users: Writable<string[]>;
			addUser: (id: string) => void;
			removeUser: (id: string) => void;
		}>(ONLINE_CONTEXT_KEY);
	}

	const users: Writable<string[]> = writable([]);

	const addUser = (user_id: string) => {
		users.update((currentUsers) => {
			if (!currentUsers.includes(user_id)) {
				return [...currentUsers, user_id];
			}
			return currentUsers;
		});
	};

	const removeUser = (user_id: string) => {
		users.update((currentUsers) => currentUsers.filter((id) => id !== user_id));
	};

	setContext(ONLINE_CONTEXT_KEY, { users, addUser, removeUser });

	return { users, addUser, removeUser };
};

export const getUserOnline = () => {
	return getContext<{
		users: Writable<string[]>;
		addUser: (id: string) => void;
		removeUser: (id: string) => void;
	}>(ONLINE_CONTEXT_KEY);
};

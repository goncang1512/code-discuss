import { writable, type Writable } from 'svelte/store';
import { setContext, getContext } from 'svelte';
import type { User } from '@lib/auth';

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

<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import InputFloat from '@components/fragments/InputFloat.svelte';
	import { authClient } from '@lib/auth-client';
	import { goto } from '$app/navigation';

	let loading = $state(false);
	let message = $state('');
	const handleLogin = async (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		await authClient.signIn.email(
			{
				email: formData.get('email') as string,
				password: formData.get('password') as string,
				callbackURL: '/'
			},
			{
				onRequest: () => {
					loading = true;
				},
				onSuccess: () => {
					loading = false;
					form.reset();
					goto('/');
				},
				onError: (ctx: { error: { message: string } }) => {
					loading = false;
					message = ctx.error.message;
				}
			}
		);
	};
</script>

<div class="flex h-screen w-screen items-center justify-center px-3 md:px-0">
	<div class="w-md rounded-md border border-gray-100 p-3 shadow-md">
		<form onsubmit={handleLogin} class="flex flex-col gap-4">
			<p class="text-center text-red-500 italic">{message}</p>
			<h1 class="text-2xl font-semibold text-black">Login</h1>
			<InputFloat name="email" type="email" required>Email</InputFloat>
			<InputFloat name="password" type="password" required>Password</InputFloat>

			<Button color="dark" class="cursor-pointer" type="submit" disabled={loading}
				>{loading ? 'Loading...' : 'Login'}</Button
			>
		</form>
		<p class="pt-3 text-center">
			Don't have account? <a href="/register" class="text-blue-500">Sign Up</a>
		</p>
	</div>
</div>

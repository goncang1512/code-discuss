<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import InputFloat from '@components/fragments/InputFloat.svelte';
	import { authClient } from '@lib/auth-client';
	import { goto } from '$app/navigation';

	let loading = $state(false);
	let message = $state('');

	const handleRegister = async (e: SubmitEvent) => {
		e.preventDefault();
		message = '';
		loading = true;

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		if (String(formData.get('password')) !== String(formData.get('confirm'))) {
			loading = false;
			message = 'Invalid password';
			return;
		}

		await authClient.signUp.email(
			{
				email: formData.get('email') as string,
				password: formData.get('password') as string,
				name: formData.get('name') as string,
				image: 'image',
				callbackURL: '/login'
			},
			{
				onSuccess: () => {
					loading = false;
					form.reset();
					goto('/login');
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
		<form onsubmit={handleRegister} class="flex flex-col gap-4">
			<p class="text-center text-red-500 italic">{message}</p>
			<h1 class="text-2xl font-semibold text-black">Register</h1>
			<InputFloat name="name" type="text" required>Username</InputFloat>
			<InputFloat name="email" type="email" required>Email</InputFloat>
			<InputFloat name="password" type="password" required>Password</InputFloat>
			<InputFloat name="confirm" type="password" required>Confirm Password</InputFloat>

			<Button color="dark" class="cursor-pointer" type="submit" disabled={loading}
				>{loading ? 'Loading...' : 'Register'}</Button
			>
		</form>
		<p class="pt-3 text-center">
			Have an account? <a href="/login" class="text-blue-500">Sign In</a>
		</p>
	</div>
</div>

<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import InputFloat from '@components/fragments/InputFloat.svelte';
	import { authClient } from '@lib/auth-client';
	import { goto } from '$app/navigation';
	import SocialAuth from '@components/fragments/SocialAuth.svelte';
	import { ArrowLeft } from '@lucide/svelte';

	let loading = $state(false);
	let message = $state('');
	let seeField = $state(false);

	let field = $state({
		name: '',
		email: '',
		password: '',
		confirm: ''
	});

	const handleRegister = async (e: SubmitEvent) => {
		e.preventDefault();
		message = '';
		loading = true;

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		formData.append('name', field.name);
		formData.append('email', field.email);

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
					goto('/login');
				},
				onError: (ctx: { error: { message: string } }) => {
					loading = false;
					message = ctx.error.message;

					console.log(ctx);
				}
			}
		);
	};
</script>

<div class="flex h-screen w-screen items-center justify-center px-3 md:px-0">
	<div class="w-md rounded-md border border-gray-100 p-3 shadow-md">
		<h1 class="pb-3 text-2xl font-semibold text-black">Sign Up</h1>
		<SocialAuth />
		<div class="flex w-full items-center gap-2">
			<hr class="w-full text-gray-300" />
			<p class="text-gray-400">OR</p>
			<hr class="w-full text-gray-300" />
		</div>
		<form onsubmit={handleRegister} class="flex flex-col gap-4">
			<p class="text-center text-red-500 italic">{message}</p>
			{#if !seeField}
				<InputFloat name="name" bind:value={field.name} type="text" required>Username</InputFloat>
				<InputFloat name="email" bind:value={field.email} type="email" required>Email</InputFloat>
				<Button
					onclick={() => (seeField = true)}
					color="dark"
					class="cursor-pointer"
					type="button"
					disabled={loading}>Regsiter</Button
				>
			{:else}
				<InputFloat type="password" autofocus name="password" bind:value={field.password} required
					>Password</InputFloat
				>
				<InputFloat type="password" name="confirm" bind:value={field.confirm} required
					>Confirm Password</InputFloat
				>
				<div class="flex w-full gap-2">
					<Button
						onclick={() => (seeField = false)}
						color="dark"
						class="w-[10%] flex-none cursor-pointer p-0"
						type="button"
						disabled={loading}
					>
						<ArrowLeft />
					</Button>
					<Button color="dark" class="flex-1 cursor-pointer" type="submit" disabled={loading}
						>{loading ? 'Loading...' : 'Sign up'}</Button
					>
				</div>
			{/if}
		</form>
		<p class="pt-3 text-center">
			Have an account? <a href="/login" class="text-blue-500">Sign In</a>
		</p>
	</div>
</div>

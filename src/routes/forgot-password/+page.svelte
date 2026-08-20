<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import Button from '$lib/components/Button.svelte';
	import Logo from '$lib/components/Logo.svelte';

	let email = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;
		success = false;
		try {
			await api.forgotPassword(email.trim());
			success = true;
			email = '';
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to send reset code. Try again.';
			if (
				message.toLowerCase().includes('too many') ||
				message.toLowerCase().includes('rate limit')
			) {
				error = 'Too many reset requests. Please wait a while before trying again.';
			} else {
				error = message;
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-dvh flex-col justify-center px-6 py-12">
	<div class="mx-auto w-full max-w-sm">
		<div class="mb-10 flex flex-col items-center">
			<Logo />
			<h1
				class="mt-4 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white"
			>
				Reset Password
			</h1>
		</div>

		{#if success}
			<div
				class="mb-6 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400"
			>
				Check your email for a password reset code.
			</div>
		{/if}

		<form onsubmit={submit} class="space-y-4">
			<input
				bind:value={email}
				type="email"
				placeholder="Email address"
				autocomplete="email"
				autocapitalize="none"
				required
				class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
			/>

			{#if error}
				<p class="text-center text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
			{/if}

			<Button type="submit" {loading} disabled={!email.trim()}>Send Reset Link</Button>
		</form>

		<p class="mt-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
			Remember your password?
			<a
				href="/login"
				class="text-springbok dark:text-sa-yellow font-black underline-offset-4 hover:underline"
				>Sign In</a
			>
		</p>

		<p class="mt-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
			Don't have an account?
			<a
				href="/register"
				class="text-springbok dark:text-sa-yellow font-black underline-offset-4 hover:underline"
				>Register</a
			>
		</p>

		<div class="border-springbok dark:border-sa-yellow mt-8 rounded-3xl border-2 p-6 text-center">
			<p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Want to try first?</p>
			<a
				href="/thirty-seconds/demo"
				class="text-springbok dark:text-sa-yellow mt-2 inline-block font-black underline-offset-4 hover:underline"
			>
				Play Guest Mode
			</a>
		</div>
	</div>
</div>

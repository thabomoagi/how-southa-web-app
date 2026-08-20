<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import Button from '$lib/components/Button.svelte';
	import Logo from '$lib/components/Logo.svelte';

	let token = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function submit(e: SubmitEvent) {
		e.preventDefault();

		error = '';
		success = false;

		if (newPassword.length < 8) {
			error = 'Password must be at least 8 characters.';
			return;
		}

		if (newPassword !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}

		loading = true;

		try {
			await api.resetPassword(token.trim(), newPassword);

			success = true;
			token = '';
			newPassword = '';
			confirmPassword = '';

			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to reset password. Please try again.';

			error = message;
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
				Create New Password
			</h1>

			<p class="mt-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
				Enter the reset code from your email and choose a new password.
			</p>
		</div>

		{#if success}
			<div
				class="mb-6 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400"
			>
				Password updated successfully. Redirecting to sign in...
			</div>
		{/if}

		<form onsubmit={submit} class="space-y-4">
			<input
				bind:value={token}
				type="text"
				placeholder="Reset code"
				autocomplete="one-time-code"
				required
				class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
			/>

			<input
				bind:value={newPassword}
				type="password"
				placeholder="New password"
				autocomplete="new-password"
				minlength="8"
				required
				class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
			/>

			<input
				bind:value={confirmPassword}
				type="password"
				placeholder="Confirm new password"
				autocomplete="new-password"
				minlength="8"
				required
				class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
			/>

			{#if error}
				<p class="text-center text-sm font-bold text-red-600 dark:text-red-400">
					{error}
				</p>
			{/if}

			<Button type="submit" {loading} disabled={!token.trim() || !newPassword || !confirmPassword}>
				Reset Password
			</Button>
		</form>

		<p class="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
			Remember your password?
			<a
				href="/login"
				class="text-springbok dark:text-sa-yellow font-black underline-offset-4 hover:underline"
			>
				Sign In
			</a>
		</p>

		<p class="mt-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
			Need a new reset code?
			<a
				href="/forgot-password"
				class="text-springbok dark:text-sa-yellow font-black underline-offset-4 hover:underline"
			>
				Request Again
			</a>
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

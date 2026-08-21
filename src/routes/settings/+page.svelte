<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	let newUsername = $state('');
	let usernameLoading = $state(false);
	let usernameError = $state('');
	let usernameSuccess = $state(false);

	onMount(() => {
		auth.init();
		if (!auth.user) {
			goto('/login');
		}
		newUsername = auth.user?.username || '';
	});

	async function changeUsername() {
		usernameError = '';
		usernameSuccess = false;

		if (!newUsername.trim() || newUsername.trim().length < 3) {
			usernameError = 'Username must be at least 3 characters';
			return;
		}

		usernameLoading = true;
		try {
			await api.updateUser({ username: newUsername.trim() });
			const currentUser = auth.user;
			if (currentUser) {
				currentUser.username = newUsername.trim();
				localStorage.setItem('user', JSON.stringify(currentUser));
			}
			usernameSuccess = true;
		} catch (err) {
			usernameError = err instanceof Error ? err.message : 'Failed to update username';
		} finally {
			usernameLoading = false;
		}
	}

	async function changePassword() {
		error = '';
		success = false;

		if (newPassword.length < 8) {
			error = 'New password must be at least 8 characters';
			return;
		}

		if (newPassword !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;
		try {
			await api.changePassword(currentPassword, newPassword);
			success = true;
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to change password';
		} finally {
			loading = false;
		}
	}

	function logout() {
		const refreshToken = localStorage.getItem('refreshToken');
		if (refreshToken) {
			api.logout(refreshToken).catch(() => {});
		}
		auth.logout();
		goto('/login');
	}
</script>

<div class="dark:bg-dark-bg flex min-h-dvh flex-col bg-white px-6 py-12">
	<div class="mx-auto w-full max-w-md">
		<h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>

		<div class="mt-8 space-y-6">
			<div class="rounded-2xl border-2 border-slate-200 p-6 dark:border-slate-700">
				<h2 class="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
				<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
					Dark mode is managed by your system
				</p>
			</div>

			<div class="rounded-2xl border-2 border-slate-200 p-6 dark:border-slate-700">
				<h2 class="text-lg font-bold text-slate-900 dark:text-white">Change Username</h2>

				{#if usernameSuccess}
					<div
						class="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400"
					>
						Username updated successfully
					</div>
				{/if}

				<form
					onsubmit={(e) => {
						e.preventDefault();
						changeUsername();
					}}
					class="mt-4 space-y-4"
				>
					<input
						bind:value={newUsername}
						type="text"
						placeholder="New username"
						autocomplete="username"
						required
						minlength="3"
						class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
					/>

					{#if usernameError}
						<p class="text-center text-sm font-bold text-red-600 dark:text-red-400">
							{usernameError}
						</p>
					{/if}

					<button
						type="submit"
						disabled={usernameLoading ||
							!newUsername.trim() ||
							newUsername.trim() === auth.user?.username}
						class="bg-springbok shadow-springbok/25 dark:bg-springbok-bright w-full rounded-2xl px-6 py-4 text-center text-lg font-black text-white shadow-xl transition-transform active:scale-[0.98] disabled:opacity-50"
					>
						{usernameLoading ? 'Updating...' : 'Update Username'}
					</button>
				</form>
			</div>

			<div class="rounded-2xl border-2 border-slate-200 p-6 dark:border-slate-700">
				<h2 class="text-lg font-bold text-slate-900 dark:text-white">Change Password</h2>

				{#if success}
					<div
						class="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400"
					>
						Password updated successfully
					</div>
				{/if}

				<form
					onsubmit={(e) => {
						e.preventDefault();
						changePassword();
					}}
					class="mt-4 space-y-4"
				>
					<input
						bind:value={currentPassword}
						type="password"
						placeholder="Current password"
						autocomplete="current-password"
						required
						class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
					/>
					<input
						bind:value={newPassword}
						type="password"
						placeholder="New password (min 8 characters)"
						autocomplete="new-password"
						required
						minlength="8"
						class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
					/>
					<input
						bind:value={confirmPassword}
						type="password"
						placeholder="Confirm new password"
						autocomplete="new-password"
						required
						minlength="8"
						class="focus:border-springbok dark:bg-dark-surface w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:placeholder:text-slate-500"
					/>

					{#if error}
						<p class="text-center text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
					{/if}

					<button
						type="submit"
						disabled={loading || !currentPassword || !newPassword || !confirmPassword}
						class="bg-springbok shadow-springbok/25 dark:bg-springbok-bright w-full rounded-2xl px-6 py-4 text-center text-lg font-black text-white shadow-xl transition-transform active:scale-[0.98] disabled:opacity-50"
					>
						{loading ? 'Updating...' : 'Update Password'}
					</button>
				</form>
			</div>

			<div class="rounded-2xl border-2 border-slate-200 p-6 dark:border-slate-700">
				<h2 class="text-lg font-bold text-slate-900 dark:text-white">Account</h2>
				<button
					onclick={logout}
					class="mt-4 w-full rounded-2xl bg-red-500 px-6 py-4 text-center text-lg font-black text-white shadow-xl shadow-red-500/25 transition-transform active:scale-[0.98] dark:bg-red-600"
				>
					Log Out
				</button>
			</div>
		</div>

		<a
			href="/home"
			class="mt-8 block text-center text-sm font-bold text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
		>
			Back to home
		</a>
	</div>
</div>

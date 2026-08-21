<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let stats = $state<any>(null);
	let user = $state<any>(null);

	onMount(async () => {
		auth.init();

		if (!auth.user) {
			goto('/login');
			return;
		}

		user = auth.user;

		try {
			stats = await api.getStats();
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load stats';
			loading = false;
		}
	});

	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<div class="dark:bg-dark-bg flex min-h-dvh flex-col bg-white px-6 py-12">
	{#if loading}
		<div class="flex flex-1 flex-col items-center justify-center gap-4">
			<div
				class="border-springbok/30 border-t-springbok h-12 w-12 animate-spin rounded-full border-4"
			></div>
			<p class="text-lg font-bold text-slate-600 dark:text-slate-300">Loading stats...</p>
		</div>
	{:else if error}
		<div class="flex flex-1 flex-col items-center justify-center gap-6">
			<p class="text-xl font-bold text-red-500">{error}</p>
			<button
				onclick={() => goto('/home')}
				class="bg-springbok rounded-2xl px-8 py-4 text-lg font-black text-white">GO HOME</button
			>
		</div>
	{:else}
		<h1 class="text-center text-4xl font-black tracking-tight text-slate-900 dark:text-white">
			Your Stats
		</h1>

		<div class="mt-4 text-center">
			<p class="text-2xl font-black text-slate-900 dark:text-white">{user?.username}</p>
			<p class="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
			<p class="mt-1 text-xs text-slate-400 dark:text-slate-500">
				Member since {formatDate(user?.createdAt)}
			</p>
		</div>

		<div class="mt-10 flex flex-1 flex-col gap-5">
			<div class="bg-sa-yellow shadow-sa-yellow/20 rounded-3xl p-6 shadow-lg">
				<p class="text-xl font-black text-slate-900">Multiple Choice</p>
				<div class="mt-4">
					<p class="text-xs font-black tracking-widest text-slate-800/60 uppercase">Games Played</p>
					<p class="mt-1 text-4xl font-black text-slate-900">{stats?.totalMcqGames ?? 0}</p>
				</div>
			</div>

			<div class="bg-springbok shadow-springbok/20 rounded-3xl p-6 shadow-lg">
				<p class="text-xl font-black text-white">30 Seconds</p>
				<div class="mt-4">
					<p class="text-xs font-black tracking-widest text-white/60 uppercase">Games Played</p>
					<p class="mt-1 text-4xl font-black text-white">{stats?.totalThirtySecondsGames ?? 0}</p>
				</div>
			</div>

			<div class="rounded-3xl border-2 border-slate-200 p-6 dark:border-slate-700">
				<p class="text-lg font-bold text-slate-900 dark:text-white">Total Games</p>
				<div class="mt-4">
					<p
						class="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-400"
					>
						All Games Played
					</p>
					<p class="text-springbok dark:text-sa-yellow mt-1 text-4xl font-black">
						{stats?.totalGamesPlayed ?? 0}
					</p>
				</div>
			</div>
		</div>

		<a
			href="/settings"
			class="mt-8 block text-center text-sm font-bold text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
		>
			Manage account
		</a>
	{/if}
</div>

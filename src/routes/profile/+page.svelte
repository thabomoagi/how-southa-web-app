<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	let stats = $state<any>(null);
	let user = $state<any>(null);
	let location = $state('');

	onMount(async () => {
		auth.init();

		if (!auth.user) {
			goto('/login');
			return;
		}

		user = auth.user;

		try {
			const response = await fetch('https://ipapi.co/json/');
			if (response.ok) {
				const data = await response.json();
				location = `${data.city || ''}, ${data.country_name || ''}`.replace(/^, /, '');
			}
		} catch {
			location = 'Unknown';
		}

		try {
			stats = await api.getStats();
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load stats';
			loading = false;
		}
	});

	function getInitials(username: string) {
		if (!username) return '?';
		return username.charAt(0).toUpperCase();
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
		<div class="flex flex-col items-center">
			<div
				class="bg-springbok shadow-springbok/25 dark:bg-springbok-bright flex h-20 w-20 items-center justify-center rounded-full text-4xl font-black text-white shadow-xl"
			>
				{getInitials(user?.username)}
			</div>
			<h1
				class="mt-4 text-center text-2xl font-black tracking-tight text-slate-900 dark:text-white"
			>
				{user?.username}
			</h1>
			{#if location}
				<p class="text-sm text-slate-500 dark:text-slate-400">{location}</p>
			{/if}
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

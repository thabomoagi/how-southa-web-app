<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	type Period = 'ALL' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

	type LeaderboardEntry = {
		rank: number;
		userId: string;
		username: string;
		profilePictureUrl: string | null;
		score: number;
	};

	let loading = $state(true);
	let error = $state('');
	let period = $state<Period>('ALL');
	let entries = $state<LeaderboardEntry[]>([]);

	const periods: Period[] = ['ALL', 'DAILY', 'WEEKLY', 'MONTHLY'];

	onMount(() => {
		loadLeaderboard();
	});

	async function loadLeaderboard() {
		loading = true;
		error = '';

		try {
			const data = await api.getLeaderboard(period, 20);

			entries = data?.entries ?? [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load leaderboard';
		} finally {
			loading = false;
		}
	}

	function selectPeriod(newPeriod: Period) {
		period = newPeriod;
		loadLeaderboard();
	}

	function getMedal(rank: number) {
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';

		return `#${rank}`;
	}

	function getMedalClass(rank: number) {
		if (rank === 1) return 'text-sa-yellow';
		if (rank === 2) return 'text-slate-400';
		if (rank === 3) return 'text-amber-600';

		return 'text-slate-500 dark:text-slate-400';
	}
</script>

<div class="dark:bg-dark-bg flex min-h-dvh flex-col bg-white px-6 py-12">
	<h1 class="text-center text-4xl font-black tracking-tight text-slate-900 dark:text-white">
		Leaderboard
	</h1>

	<div class="mt-6 flex justify-center gap-2">
		{#each periods as p}
			<button
				type="button"
				onclick={() => selectPeriod(p)}
				class="rounded-full px-4 py-2 text-sm font-bold transition-colors
					{period === p
					? 'bg-springbok dark:bg-springbok-bright text-white'
					: 'dark:bg-dark-surface bg-slate-100 text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'}"
			>
				{p}
			</button>
		{/each}
	</div>

	{#if loading}
		<div class="flex flex-1 flex-col items-center justify-center gap-4">
			<div
				class="border-springbok/30 border-t-springbok h-12 w-12 animate-spin rounded-full border-4"
			></div>

			<p class="text-lg font-bold text-slate-600 dark:text-slate-300">Loading leaderboard...</p>
		</div>
	{:else if error}
		<div class="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<div>
				<p class="text-xl font-bold text-red-500">
					{error}
				</p>

				<p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
					We couldn't load the leaderboard.
				</p>
			</div>

			<button
				type="button"
				onclick={loadLeaderboard}
				class="bg-springbok shadow-springbok/25 dark:bg-springbok-bright rounded-2xl px-8 py-4 text-lg font-black text-white shadow-xl"
			>
				RETRY
			</button>
		</div>
	{:else if entries.length === 0}
		<div class="flex flex-1 flex-col items-center justify-center text-center">
			<p class="text-xl font-bold text-slate-500 dark:text-slate-400">No scores yet</p>

			<p class="mt-2 text-sm text-slate-400 dark:text-slate-500">
				Be the first to play and claim the top spot!
			</p>
		</div>
	{:else}
		<div class="mt-6 flex flex-1 flex-col gap-2">
			{#each entries as entry}
				<div
					class="dark:bg-dark-surface flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 dark:border-slate-700"
				>
					<div class="w-12 text-center text-xl font-black {getMedalClass(entry.rank)}">
						{getMedal(entry.rank)}
					</div>

					{#if entry.profilePictureUrl}
						<img
							src={entry.profilePictureUrl}
							alt={entry.username}
							class="h-10 w-10 rounded-full object-cover"
						/>
					{:else}
						<div
							class="bg-springbok dark:bg-springbok-bright flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white"
						>
							{entry.username.charAt(0).toUpperCase()}
						</div>
					{/if}

					<div class="min-w-0 flex-1">
						<p class="truncate text-lg font-bold text-slate-900 dark:text-white">
							{entry.username}
						</p>
					</div>

					<div class="text-right">
						<p class="text-springbok dark:text-sa-yellow text-2xl font-black">
							{entry.score}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<a
		href="/home"
		class="mt-8 block text-center text-sm font-bold text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
	>
		Back to home
	</a>
</div>

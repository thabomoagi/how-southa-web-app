<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		auth.init();

		if (!auth.user) {
			goto('/login');
		}
	});
</script>

<div class="dark:bg-dark-bg flex min-h-dvh flex-col bg-white">
	<main class="flex flex-1 flex-col items-center justify-center px-6">
		<Logo />
		<h1 class="mt-4 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
			How Southa Are You?
		</h1>

		<div class="mt-12 flex w-full max-w-sm flex-col gap-5">
			<a
				href="/thirty-seconds"
				class="bg-springbok shadow-springbok/25 dark:bg-springbok-bright rounded-3xl px-6 py-8 text-center text-3xl font-black tracking-wide text-white shadow-xl transition-transform active:scale-[0.98]"
			>
				30 Seconds
			</a>
			<a
				href="/multiple-choice"
				class="bg-sa-yellow shadow-sa-yellow/25 rounded-3xl px-6 py-8 text-center text-3xl font-black tracking-wide text-slate-900 shadow-xl transition-transform active:scale-[0.98]"
			>
				Multiple Choice
			</a>
		</div>
	</main>

	<footer class="flex items-center justify-center gap-10 px-6 py-8">
		<a
			href="/profile"
			class="text-sm font-bold text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
		>
			Profile
		</a>

		<a
			href="/leaderboard"
			class="text-sm font-bold text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
		>
			Leaderboard
		</a>

		<a
			href="/settings"
			class="text-sm font-bold text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
		>
			Settings
		</a>
	</footer>
</div>

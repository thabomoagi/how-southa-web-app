<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		auth.init();
		if (!auth.user) {
			goto('/login');
		}
	});

	function logout() {
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

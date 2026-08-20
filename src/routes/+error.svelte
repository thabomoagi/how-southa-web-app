<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';

	let status = $derived($page.status);
</script>

<div class="dark:bg-dark-bg flex min-h-dvh flex-col items-center justify-center bg-white px-6">
	<Logo />
	<h1 class="mt-6 text-6xl font-black text-slate-900 dark:text-white">
		{status === 404 ? '404' : 'Error'}
	</h1>
	<p class="mt-2 text-xl font-bold text-slate-600 dark:text-slate-300">
		{status === 404 ? 'Page not found' : 'Something went wrong'}
	</p>
	<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
		{status === 404 ? 'The page you are looking for does not exist.' : 'Please try again later.'}
	</p>
	<button
		onclick={() => goto('/')}
		class="bg-springbok shadow-springbok/30 dark:bg-springbok-bright mt-8 rounded-3xl px-8 py-4 text-lg font-black text-white shadow-xl transition-transform active:scale-[0.98]"
	>
		Go Home
	</button>
</div>

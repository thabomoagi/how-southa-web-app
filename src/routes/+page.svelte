<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		auth.init();

		if (auth.user) {
			goto('/home');
		} else {
			goto('/login');
		}
	});
</script>

<div class="dark:bg-dark-bg flex min-h-dvh items-center justify-center bg-white">
	<div
		class="border-springbok/30 border-t-springbok h-12 w-12 animate-spin rounded-full border-4"
	></div>
</div>

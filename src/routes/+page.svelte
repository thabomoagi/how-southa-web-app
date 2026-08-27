<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { api } from '$lib/api';

	if (browser) {
		// Try to fetch the current user — if it fails, session is invalid
		api.getStats()
			.then(() => goto('/home', { replaceState: true }))
			.catch(() => {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				goto('/login', { replaceState: true });
			});
	}
</script>
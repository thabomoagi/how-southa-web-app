<script lang="ts">
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    if (browser) {
        const token = localStorage.getItem('accessToken');
        goto(token ? '/home' : '/login', { replaceState: true });
    }
</script>
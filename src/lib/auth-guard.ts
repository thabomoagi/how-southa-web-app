import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.svelte';

/**
 * Client-side route guard.
 * Initialises the session and redirects unauthenticated users to /login.
 */
export function requireAuth(): boolean {
    if (typeof window === 'undefined') return false;

    auth.init();

    if (auth.user && localStorage.getItem('accessToken')) {
        return true;
    }

    goto('/login');
    return false;
}
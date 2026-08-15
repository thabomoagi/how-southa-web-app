<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/api';
    import { auth } from '$lib/stores/auth.svelte';
    import { onMount } from 'svelte';

    let loading = $state(true);
    let error = $state('');
    let stats = $state<any>(null);

    onMount(async () => {
        try {
            stats = await api.getStats();
            loading = false;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load stats';
            loading = false;
        }
    });

    function logout() {
        auth.logout();
        goto('/login');
    }
</script>

<div class="flex min-h-dvh flex-col bg-white px-6 py-12 dark:bg-dark-bg">
    {#if loading}
        <div class="flex flex-1 flex-col items-center justify-center gap-4">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-springbok/30 border-t-springbok"></div>
            <p class="text-lg font-bold text-slate-600 dark:text-slate-300">Loading stats...</p>
        </div>
    {:else if error}
        <div class="flex flex-1 flex-col items-center justify-center gap-6">
            <p class="text-xl font-bold text-red-500">{error}</p>
            <button onclick={() => goto('/home')} class="rounded-2xl bg-springbok px-8 py-4 text-lg font-black text-white">GO HOME</button>
        </div>
    {:else}
        <h1 class="text-center text-4xl font-black tracking-tight text-slate-900 dark:text-white">Your Stats</h1>

        <div class="mt-10 flex flex-1 flex-col gap-5">
            <div class="rounded-3xl bg-sa-yellow p-6 shadow-lg shadow-sa-yellow/20">
                <p class="text-xl font-black text-slate-900">Multiple Choice</p>
                <div class="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs font-black uppercase tracking-widest text-slate-800/60">Games Played</p>
                        <p class="mt-1 text-4xl font-black text-slate-900">{stats?.totalQnaAttempts ?? 0}</p>
                    </div>
                    <div>
                        <p class="text-xs font-black uppercase tracking-widest text-slate-800/60">Best Score</p>
                        <p class="mt-1 text-4xl font-black text-slate-900">{stats?.qnaBestScore ?? 0}</p>
                    </div>
                </div>
            </div>

            <div class="rounded-3xl bg-springbok p-6 shadow-lg shadow-springbok/20">
                <p class="text-xl font-black text-white">30 Seconds</p>
                <div class="mt-4">
                    <p class="text-xs font-black uppercase tracking-widest text-white/60">Games Played</p>
                    <p class="mt-1 text-4xl font-black text-white">{stats?.totalThirtySecondsGames ?? 0}</p>
                </div>
            </div>
        </div>

        <button
            onclick={logout}
            class="w-full rounded-3xl border-2 border-red-400 px-6 py-4 text-xl font-black text-red-500 active:scale-[0.98] dark:border-red-900 dark:text-red-400"
        >
            Log Out
        </button>
    {/if}
</div>
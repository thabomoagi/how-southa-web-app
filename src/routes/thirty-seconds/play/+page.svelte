<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/api';
    import { auth } from '$lib/stores/auth.svelte';
    import { onMount } from 'svelte';

    let loading = $state(true);
    let error = $state('');
    let gameId = $state('');
    let roundId = $state<any>('');
    let words = $state<string[]>([]);
    let timeLeft = $state(30);
    let gameActive = $state(false);

    onMount(async () => {
        try {
            const playerName = auth.user?.username || 'Player 1';
            const res: any = await api.startThirtySeconds([playerName], 1);
            const round = Array.isArray(res.rounds) ? res.rounds[0] : null;
            gameId = res.gameId ?? '';
            roundId = round?.roundId ?? '';
            words = (round?.prompt ?? '')
                .split(',')
                .map((w: string) => w.trim())
                .filter((w: string) => w.length > 0);
            loading = false;
            gameActive = true;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to start game';
            loading = false;
        }
    });

    $effect(() => {
        if (gameActive) {
            const id = setInterval(() => {
                if (timeLeft <= 1) {
                    clearInterval(id);
                    goto(`/thirty-seconds/result?gameId=${gameId}&roundId=${roundId}`);
                } else {
                    timeLeft--;
                }
            }, 1000);
            return () => clearInterval(id);
        }
    });
</script>

{#if loading}
    <div class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white dark:bg-dark-bg">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-springbok/30 border-t-springbok"></div>
        <p class="text-lg font-bold text-slate-600 dark:text-slate-300">Waking up the server...</p>
    </div>
{:else if error}
    <div class="flex min-h-dvh flex-col items-center justify-center gap-6 bg-white px-6 dark:bg-dark-bg">
        <p class="text-xl font-bold text-red-500">{error}</p>
        <button onclick={() => goto('/home')} class="rounded-2xl bg-springbok px-8 py-4 text-lg font-black text-white">GO HOME</button>
    </div>
{:else}
    <div class="flex min-h-dvh flex-col bg-white dark:bg-dark-bg">
        <header class="flex items-center justify-center px-6 py-6">
            <div class="relative h-28 w-28">
                <svg class="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
                    <path
                        class="text-slate-200 dark:text-slate-700"
                        stroke="currentColor"
                        stroke-width="2.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        class={timeLeft > 10 ? 'text-springbok' : timeLeft > 5 ? 'text-sa-yellow' : 'text-red-500'}
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-dasharray="{(timeLeft / 30) * 100}, 100"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-5xl font-black text-slate-900 dark:text-white">
                    {timeLeft}
                </span>
            </div>
        </header>

        <main class="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            {#each words as word}
                <div class="w-full max-w-md rounded-2xl bg-springbok/10 px-6 py-4 text-center dark:bg-springbok/20">
                    <span class="text-3xl font-black uppercase tracking-wide text-springbok dark:text-springbok-bright">{word}</span>
                </div>
            {/each}
        </main>

        <footer class="px-6 py-8 text-center">
            <p class="text-lg font-bold text-slate-500 dark:text-slate-400">Describe the words without saying them!</p>
        </footer>
    </div>
{/if}
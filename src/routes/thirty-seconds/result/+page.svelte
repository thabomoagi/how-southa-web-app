<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { api } from '$lib/api';

    let gameId = $derived($page.url.searchParams.get('gameId') || '');
    let roundIdRaw = $derived($page.url.searchParams.get('roundId') || '');
    let roundId: any = $derived(/^\d+$/.test(roundIdRaw) ? Number(roundIdRaw) : roundIdRaw);

    let score = $state(0);
    let loading = $state(false);
    let error = $state('');

    async function finish() {
        if (!gameId || !roundIdRaw) {
            error = 'Missing game data.';
            return;
        }
        loading = true;
        error = '';
        try {
            await api.scoreRound(gameId, roundId, score);
            await api.completeGame(gameId);
            goto('/home');
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to save score';
            loading = false;
        }
    }
</script>

<div class="flex min-h-dvh flex-col bg-white px-6 py-12 dark:bg-dark-bg">
    <div class="flex flex-1 flex-col items-center justify-center text-center">
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Time's Up!</h1>
        <p class="mt-4 text-xl font-bold text-slate-600 dark:text-slate-300">How many did your friend get?</p>

        <div class="mt-12 grid w-full max-w-sm grid-cols-6 gap-2">
            {#each [0, 1, 2, 3, 4, 5] as n}
                <button
                    onclick={() => (score = n)}
                    class="aspect-square rounded-2xl text-2xl font-black transition-all active:scale-95 {score === n
                        ? 'bg-sa-yellow text-slate-900 shadow-lg shadow-sa-yellow/30'
                        : 'bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-slate-300'}"
                >
                    {n}
                </button>
            {/each}
        </div>

        <p class="mt-8 text-lg font-bold text-slate-600 dark:text-slate-300">
            Your friend got: <span class="text-2xl font-black text-springbok dark:text-sa-yellow">{score}</span> out of 5
        </p>
    </div>

    {#if error}
        <p class="mb-4 text-center text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
    {/if}

    <button
        onclick={finish}
        disabled={loading}
        class="w-full rounded-3xl bg-springbok px-6 py-5 text-2xl font-black tracking-wider text-white shadow-xl shadow-springbok/30 active:scale-[0.98] disabled:opacity-50 dark:bg-springbok-bright"
    >
        {#if loading}SAVING...{:else}FINISH{/if}
    </button>
</div>
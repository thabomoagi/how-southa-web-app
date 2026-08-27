<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/api';
    import { auth } from '$lib/stores/auth.svelte';
    import { requireAuth } from '$lib/auth-guard';
    import { onMount } from 'svelte';

    let loading = $state(true);
    let error = $state('');
    let words = $state<string[]>([]);
    let timeLeft = $state(30);
    let gameActive = $state(false);

    let gameId = '';
    let roundId = '';

    onMount(async () => {
        if (!requireAuth()) return;

        try {
            const playerName = auth.user?.username || 'Player 1';

            const res: any = await api.startThirtySeconds([playerName], 1);

            const data = res?.data ?? res;
            const rounds = data?.rounds;

            if (!Array.isArray(rounds) || rounds.length === 0) {
                throw new Error('The server did not return a game round.');
            }

            const round = rounds[0];

            gameId = data?.gameId != null ? String(data.gameId) : '';
            roundId = round?.roundId != null ? String(round.roundId) : '';

            const prompt = round?.prompt;

            if (Array.isArray(prompt)) {
                words = prompt
                    .map((word: unknown) => String(word).trim())
                    .filter((word: string) => word.length > 0);
            } else if (typeof prompt === 'string') {
                words = prompt
                    .split(',')
                    .map((word: string) => word.trim())
                    .filter((word: string) => word.length > 0);
            }

            if (words.length === 0) {
                throw new Error('The server did not return any words for this round.');
            }

            loading = false;
            gameActive = true;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to start game';
            loading = false;
        }
    });

    $effect(() => {
        if (!gameActive) return;

        const endTime = Date.now() + 30_000;

        const id = setInterval(() => {
            const remaining = Math.max(
                0,
                Math.ceil((endTime - Date.now()) / 1000)
            );

            timeLeft = remaining;

            if (remaining === 0) {
    clearInterval(id);
    const params = new URLSearchParams({
        words: words.join(',')
    });
    goto(`/thirty-seconds/result?${params.toString()}`);
}
        }, 100);

        return () => clearInterval(id);
    });
</script>

<svelte:head>
    <title>30 Seconds — How Southa Are You?</title>
    <meta
        name="description"
        content="30 seconds. Five words. How many can your friend guess?"
    />
    <meta property="og:title" content="30 Seconds — How Southa Are You?" />
</svelte:head>

{#if loading}
    <div
        class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white dark:bg-dark-bg"
    >
        <div
            class="h-12 w-12 animate-spin rounded-full border-4 border-springbok/30 border-t-springbok"
        ></div>

        <p class="text-lg font-bold text-slate-600 dark:text-slate-300">
            Waking up the server...
        </p>
    </div>

{:else if error}
    <div
        class="flex min-h-dvh flex-col items-center justify-center gap-6 bg-white px-6 dark:bg-dark-bg"
    >
        <p class="max-w-sm text-center text-xl font-bold text-red-500">
            {error}
        </p>

        <div class="flex w-full max-w-sm flex-col gap-3">
            <button
                type="button"
                onclick={() => location.reload()}
                class="w-full rounded-2xl bg-springbok px-6 py-4 text-lg font-black text-white shadow-lg shadow-springbok/20 active:scale-[0.98] dark:bg-springbok-bright"
            >
                RETRY
            </button>

            <button
                type="button"
                onclick={() => goto('/home')}
                class="w-full rounded-2xl border-2 border-slate-200 px-6 py-4 text-lg font-black text-slate-600 active:scale-[0.98] dark:border-slate-700 dark:text-slate-300"
            >
                GO HOME
            </button>
        </div>
    </div>

{:else}
    <div class="flex min-h-dvh flex-col bg-white dark:bg-dark-bg">
        <header class="flex items-center justify-center px-6 py-6">
            <div class="relative h-28 w-28">
                <svg
                    class="h-28 w-28 -rotate-90"
                    viewBox="0 0 36 36"
                    aria-hidden="true"
                >
                    <path
                        class="text-slate-200 dark:text-slate-700"
                        stroke="currentColor"
                        stroke-width="2.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />

                    <path
                        class={
                            timeLeft > 10
                                ? 'text-springbok'
                                : timeLeft > 5
                                    ? 'text-sa-yellow'
                                    : 'text-red-500'
                        }
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-dasharray="{(timeLeft / 30) * 100}, 100"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>

                <span
                    class="absolute inset-0 flex items-center justify-center text-5xl font-black tabular-nums text-slate-900 dark:text-white"
                    aria-label={`${timeLeft} seconds remaining`}
                >
                    {timeLeft}
                </span>
            </div>
        </header>

        <main class="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            {#each words as word}
                <div
                    class="w-full max-w-md rounded-2xl bg-springbok/10 px-6 py-4 text-center dark:bg-springbok/20"
                >
                    <span
                        class="text-3xl font-black uppercase tracking-wide text-springbok dark:text-springbok-bright"
                    >
                        {word}
                    </span>
                </div>
            {/each}
        </main>

        <footer class="px-6 py-8 text-center">
            <p class="text-lg font-bold text-slate-500 dark:text-slate-400">
                Describe the words without saying them!
            </p>
        </footer>
    </div>
{/if}
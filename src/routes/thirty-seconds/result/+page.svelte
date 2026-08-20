<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    let wordsParam = $derived($page.url.searchParams.get('words') || '');
    let words = $state<string[]>([]);
    let score = $state(0);
    let submitted = $state(false);

    $effect(() => {
        if (wordsParam) {
            words = wordsParam.split(',').map((w: string) => w.trim());
        }
    });

    function formatWords(words: string[]) {
        if (words.length === 0) return '';
        if (words.length === 1) return words[0];
        const last = words[words.length - 1];
        const rest = words.slice(0, -1);
        return rest.join(', ') + ' & ' + last;
    }

    function playAgain() {
        goto('/thirty-seconds/play');
    }
</script>

<div class="flex min-h-dvh flex-col bg-white px-6 py-12 dark:bg-dark-bg">
    {#if !submitted}
        <div class="flex flex-1 flex-col items-center justify-center text-center">
            <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Time's Up!</h1>
            
            {#if words.length > 0}
                <p class="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">
                    How many did your friend get from:
                </p>
                <p class="mt-2 text-xl font-bold text-springbok dark:text-sa-yellow">
                    {formatWords(words)}
                </p>
            {:else}
                <p class="mt-4 text-xl font-bold text-slate-600 dark:text-slate-300">How many did your friend get?</p>
            {/if}

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
        </div>

        <button
            onclick={() => submitted = true}
            class="w-full rounded-3xl bg-springbok px-6 py-5 text-2xl font-black tracking-wider text-white shadow-xl shadow-springbok/30 active:scale-[0.98] dark:bg-springbok-bright"
        >
            FINISH
        </button>
    {:else}
        <div class="flex flex-1 flex-col items-center justify-center text-center">
            <h1 class="text-6xl font-black text-springbok dark:text-sa-yellow">
                {score} / 5
            </h1>
            <p class="mt-2 text-xl font-bold text-slate-600 dark:text-slate-300">
                {score >= 4 ? 'Excellent!' : score >= 3 ? 'Good job!' : score >= 2 ? 'Not bad!' : 'Better luck next time!'}
            </p>

            <div class="mt-12 flex w-full max-w-sm flex-col gap-4">
                <button
                    onclick={playAgain}
                    class="rounded-3xl bg-springbok px-6 py-5 text-2xl font-black tracking-wider text-white shadow-xl shadow-springbok/30 active:scale-[0.98] dark:bg-springbok-bright"
                >
                    Play Again
                </button>
                <button
                    onclick={() => goto('/home')}
                    class="rounded-3xl border-2 border-slate-200 px-6 py-5 text-2xl font-black text-slate-600 transition-colors hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
                >
                    Home
                </button>
            </div>
        </div>
    {/if}
</div>
<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    let score = $derived(Number($page.url.searchParams.get('score') || '0'));
</script>

<div class="flex min-h-dvh flex-col bg-white px-6 py-12 dark:bg-dark-bg">
    <div class="flex flex-1 flex-col items-center justify-center text-center">
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Game Over!</h1>

        {#if score <= 5}
            <p class="mt-6 text-4xl font-black text-springbok dark:text-sa-yellow">{score} / 5 Correct</p>
        {:else}
            <div class="mt-10 flex h-44 w-44 flex-col items-center justify-center rounded-3xl bg-sa-yellow shadow-xl shadow-sa-yellow/30">
                <span class="text-6xl font-black text-slate-900">{score}</span>
                <span class="mt-1 text-sm font-black uppercase tracking-widest text-slate-800/70">Your Score</span>
            </div>
        {/if}
    </div>

    <button
        onclick={() => goto('/home')}
        class="w-full rounded-3xl bg-sa-yellow px-6 py-5 text-2xl font-black tracking-wider text-slate-900 shadow-xl shadow-sa-yellow/30 active:scale-[0.98]"
    >
        FINISH
    </button>
</div>
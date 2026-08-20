<script lang="ts">
    import { goto } from '$app/navigation';
    import Logo from '$lib/components/Logo.svelte';

    const words = ['Cyril Ramaphosa', 'Boerewors', 'Cape Town', 'Amapiano', 'Haibo'];
    const DURATION = 30;

    let timeLeft = $state(DURATION);
    let isActive = $state(true);
    let showJoin = $state(false);
    let timer: ReturnType<typeof setInterval>;

    function startTimer() {
        const endTime = Date.now() + DURATION * 1000;

        timer = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            timeLeft = remaining;

            if (remaining === 0) {
                clearInterval(timer);
                isActive = false;
                showJoin = true;
            }
        }, 100);
    }

    startTimer();

    $effect(() => {
        return () => {
            if (timer) clearInterval(timer);
        };
    });
</script>

<div class="flex min-h-dvh flex-col bg-white dark:bg-dark-bg">
    {#if !showJoin}
        <!-- Game Screen -->
        <header class="flex flex-col items-center gap-1 px-6 pt-8">
            <div
                class="text-7xl font-black tabular-nums {timeLeft > 10
                    ? 'text-springbok dark:text-springbok-bright'
                    : timeLeft > 5
                      ? 'text-sa-yellow'
                      : 'text-red-500'}"
            >
                {timeLeft}
            </div>

            <p class="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Demo Round
            </p>
        </header>

        <main class="flex flex-1 flex-col px-6 py-6">
            <div class="flex flex-col gap-4">
                {#each words as word}
                    <div class="rounded-2xl border-2 border-slate-200 bg-white px-6 py-5 text-center text-2xl font-bold text-slate-800 dark:border-slate-700 dark:bg-dark-surface dark:text-white">
                        {word}
                    </div>
                {/each}
            </div>
        </main>
    {:else}
        <!-- Join Screen -->
        <div class="flex min-h-dvh flex-col items-center justify-center px-6">
            <Logo />

            <h1 class="mt-4 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                How Southa Are You?
            </h1>

            <div class="mt-12 flex w-full max-w-sm flex-col gap-4">
                <a
                    href="/register"
                    class="rounded-3xl bg-springbok px-6 py-5 text-center text-2xl font-black text-white shadow-xl shadow-springbok/25 transition-transform active:scale-[0.98] dark:bg-springbok-bright"
                >
                    Join Now
                </a>

                <a
                    href="/login"
                    class="rounded-3xl border-2 border-springbok px-6 py-5 text-center text-2xl font-black text-springbok transition-transform active:scale-[0.98] dark:border-sa-yellow dark:text-sa-yellow"
                >
                    Sign In
                </a>
            </div>

            <a
                href="/"
                class="mt-8 text-sm font-bold text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
            >
                Back to home
            </a>
        </div>
    {/if}
</div>
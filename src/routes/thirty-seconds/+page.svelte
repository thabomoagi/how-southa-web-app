<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="flex min-h-dvh flex-col bg-white px-6 py-12 dark:bg-dark-bg">
    <div class="flex flex-1 flex-col items-center justify-center text-center">
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">30 Seconds</h1>

        <div class="mt-10 max-w-sm space-y-5 text-lg font-semibold text-slate-700 dark:text-slate-200">
            <p>It's the classic South African guessing game.</p>
            <p>You have 30 seconds to give your friend clues so they can guess the 5 words on your card.</p>
            <p>
                You may describe, explain or give hints about the words, but you
                <strong class="font-black">cannot</strong> say the words themselves.
            </p>
            <p>Try to get as many as possible before the timer reaches zero.</p>
        </div>
    </div>

    <button
        onclick={() => goto('/thirty-seconds/play')}
        class="w-full rounded-3xl bg-springbok px-6 py-5 text-2xl font-black tracking-wider text-white shadow-xl shadow-springbok/30 active:scale-[0.98] dark:bg-springbok-bright"
    >
        START GAME
    </button>
</div>
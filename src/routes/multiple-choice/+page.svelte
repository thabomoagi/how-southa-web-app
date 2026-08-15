<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="flex min-h-dvh flex-col bg-white px-6 py-12 dark:bg-dark-bg">
    <div class="flex flex-1 flex-col items-center justify-center text-center">
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Multiple Choice</h1>

        <div class="mt-10 max-w-sm space-y-5 text-lg font-semibold text-slate-700 dark:text-slate-200">
            <p>You'll have 30 seconds to answer 5 questions and test how well you know South Africa.</p>
            <p>Answer each question as quickly and accurately as possible.</p>
            <p>You will only get one answer for each question.</p>
        </div>
    </div>

    <button
        onclick={() => goto('/multiple-choice/play')}
        class="w-full rounded-3xl bg-sa-yellow px-6 py-5 text-2xl font-black tracking-wider text-slate-900 shadow-xl shadow-sa-yellow/30 active:scale-[0.98]"
    >
        START GAME
    </button>
</div>
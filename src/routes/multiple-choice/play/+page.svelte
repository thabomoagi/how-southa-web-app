<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/api';
    import { onMount } from 'svelte';

    let loading = $state(true);
    let submitting = $state(false);
    let error = $state('');
    let attemptId = $state('');
    let questions = $state<any[]>([]);
    let currentIndex = $state(0);
    let timeLeft = $state(30);
    let locked = $state(false);
    let submitted = $state(false);
    let answers = $state<any[]>([]);
    let questionShownAt = $state(Date.now());

    onMount(async () => {
        try {
            const res: any = await api.startQna(5, 120);
            attemptId = res.attemptId ?? res.id ?? '';
            questions = (res.questions ?? []).map((q: any) => ({
                id: q.id ?? q.questionId,
                text: q.prompt ?? q.questionText ?? q.text ?? q.question ?? '',
                options: (q.options ?? []).map((o: any) => ({
                    id: o.id ?? o.optionId,
                    text:
                        typeof o === 'string'
                            ? o
                            : (o.optionText ?? o.text ?? o.option ?? o.value ?? '')
                }))
            }));
            questionShownAt = Date.now();
            loading = false;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to start game';
            loading = false;
        }
    });

    $effect(() => {
        if (!loading && !error && questions.length > 0 && !submitted) {
            const id = setInterval(() => {
                if (timeLeft <= 1) {
                    clearInterval(id);
                    finishGame();
                } else {
                    timeLeft--;
                }
            }, 1000);
            return () => clearInterval(id);
        }
    });

    function selectOption(optionId: string) {
        if (locked || submitted) return;
        locked = true;
        answers = [
            ...answers,
            {
                questionId: questions[currentIndex].id,
                selectedOptionId: optionId,
                timeTakenMs: Date.now() - questionShownAt
            }
        ];
        if (currentIndex + 1 >= questions.length) {
            finishGame();
        } else {
            currentIndex++;
            questionShownAt = Date.now();
            locked = false;
        }
    }

    async function finishGame() {
        if (submitted) return;
        submitted = true;
        submitting = true;
        try {
            const res: any = await api.submitQna(attemptId, answers);
            goto(`/multiple-choice/result?score=${res.score ?? 0}`);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to submit answers';
            submitted = false;
            submitting = false;
        }
    }
</script>

{#if loading || submitting}
    <div class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white dark:bg-dark-bg">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-sa-yellow/30 border-t-sa-yellow"></div>
        <p class="text-lg font-bold text-slate-600 dark:text-slate-300">
            {submitting ? 'Calculating score...' : 'Loading questions...'}
        </p>
    </div>
{:else if error}
    <div class="flex min-h-dvh flex-col items-center justify-center gap-6 bg-white px-6 dark:bg-dark-bg">
        <p class="text-xl font-bold text-red-500">{error}</p>
        <button onclick={() => goto('/home')} class="rounded-2xl bg-sa-yellow px-8 py-4 text-lg font-black text-slate-900">GO HOME</button>
    </div>
{:else if questions.length > 0}
    <div class="flex min-h-dvh flex-col bg-white dark:bg-dark-bg">
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
                Question {currentIndex + 1} of {questions.length}
            </p>
        </header>

        <main class="flex flex-1 flex-col px-6 py-6">
            <h2 class="text-center text-3xl font-black leading-tight text-slate-900 dark:text-white">
                {questions[currentIndex].text}
            </h2>

            <div class="my-6 h-1 w-full rounded-full bg-sa-yellow"></div>

            <div class="flex flex-col gap-4">
                {#each questions[currentIndex].options as option}
                    <button
                        onclick={() => selectOption(option.id)}
                        disabled={locked}
                        class="w-full rounded-2xl border-2 border-slate-200 bg-white px-6 py-5 text-left text-xl font-bold text-slate-800 transition-all active:bg-sa-yellow disabled:opacity-60 dark:border-slate-700 dark:bg-dark-surface dark:text-white"
                    >
                        {option.text}
                    </button>
                {/each}
            </div>
        </main>
    </div>
{/if}
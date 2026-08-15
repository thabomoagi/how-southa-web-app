<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth } from '$lib/stores/auth.svelte';
    import Button from '$lib/components/Button.svelte';
    import Logo from '$lib/components/Logo.svelte';

    let identifier = $state('');
    let password = $state('');
    let loading = $state(false);
    let error = $state('');

    async function submit(e: SubmitEvent) {
        e.preventDefault();
        error = '';
        loading = true;
        try {
            await auth.login(identifier.trim(), password);
            goto('/home');
        } catch (err) {
            error = err instanceof Error ? err.message : 'Sign in failed. Try again.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex min-h-dvh flex-col justify-center px-6 py-12">
    <div class="mx-auto w-full max-w-sm">
        <div class="mb-10 flex flex-col items-center">
            <Logo />
            <h1 class="mt-4 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                How Southa Are You?
            </h1>
        </div>

        <form onsubmit={submit} class="space-y-4">
            <input
                bind:value={identifier}
                type="text"
                placeholder="Username or Email"
                autocomplete="username"
                autocapitalize="none"
                autocorrect="off"
                required
                class="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:border-springbok focus:outline-none dark:border-slate-700 dark:bg-dark-surface dark:placeholder:text-slate-500"
            />
            <input
                bind:value={password}
                type="password"
                placeholder="Password"
                autocomplete="current-password"
                required
                class="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-semibold placeholder:text-slate-400 focus:border-springbok focus:outline-none dark:border-slate-700 dark:bg-dark-surface dark:placeholder:text-slate-500"
            />

            {#if error}
                <p class="text-center text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
            {/if}

            <Button type="submit" {loading} disabled={!identifier.trim() || !password}>Sign In</Button>
        </form>

        <p class="mt-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            Don't have an account?
            <a href="/register" class="font-black text-springbok underline-offset-4 hover:underline dark:text-sa-yellow">Register</a>
        </p>
    </div>
</div>
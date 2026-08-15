<script lang="ts">
    import { theme } from '$lib/stores/theme.svelte';
</script>

<div class="flex min-h-dvh flex-col bg-white px-6 py-12 dark:bg-dark-bg">
    <h1 class="text-center text-4xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>

    <div class="mt-10 flex flex-col gap-8">
        <section>
            <h2 class="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Appearance</h2>
            <div class="mt-3 flex items-center justify-between rounded-3xl bg-slate-50 px-6 py-5 dark:bg-dark-surface">
                <p class="text-lg font-black text-slate-900 dark:text-white">Dark Mode</p>
                <button
                    onclick={theme.toggle}
                    class="relative h-9 w-16 shrink-0 rounded-full transition-colors {theme.dark ? 'bg-springbok-bright' : 'bg-slate-300'}"
                    aria-label="Toggle dark mode"
                >
                    <span
                        class="absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow transition-transform {theme.dark
                            ? 'translate-x-7'
                            : 'translate-x-0'}"
                    ></span>
                </button>
            </div>
        </section>

        <section>
            <h2 class="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Account</h2>
            <div class="mt-3 rounded-3xl bg-slate-50 px-6 py-5 dark:bg-dark-surface">
                <p class="text-lg font-black text-slate-900 dark:text-white">Reset / Change Password</p>
                <p class="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">Password reset is coming soon.</p>
            </div>
        </section>
    </div>
</div>
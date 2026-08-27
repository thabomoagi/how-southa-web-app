<script lang="ts">
    import { resolveImageUrl } from '$lib/image-url';

    let {
        src = null,
        name = '',
        alt = '',
        size = 'md'
    }: {
        src?: string | null;
        name?: string;
        alt?: string;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    } = $props();

    let failed = $state(false);

    const resolved = $derived(src ? resolveImageUrl(src) : null);
    const initial = $derived(name ? name.charAt(0).toUpperCase() : '?');

    $effect(() => {
        void resolved;
        failed = false;
    });

    const sizeClasses: Record<string, string> = {
        xs: 'h-8 w-8 text-xs',
        sm: 'h-10 w-10 text-sm',
        md: 'h-14 w-14 text-xl',
        lg: 'h-20 w-20 text-3xl',
        xl: 'h-28 w-28 text-5xl'
    };

    const fallbackClasses = $derived(
        `${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-full bg-springbok font-black text-white dark:bg-springbok-bright`
    );
</script>

{#if resolved && !failed}
    <img
        src={resolved}
        alt={alt || name}
        class="shrink-0 rounded-full object-cover {sizeClasses[size]}"
        onerror={() => (failed = true)}
    />
{:else}
    <div class={fallbackClasses} aria-hidden="true">
        {initial}
    </div>
{/if}
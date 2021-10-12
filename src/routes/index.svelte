<script lang="ts">
	import { onMount } from 'svelte';
	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';
	import Media from '$lib/Media.svelte';

	onMount(async () => {
		if ($page.query.has('code') && $page.query.has('state')) {
			// It's an oauth redirect call.
			// Resolve the token and redirect the user to a clean url
			const params = new URLSearchParams({
				code: $page.query.get('code'),
				state: $page.query.get('state')
			});

			const response = await fetch(`/auth/token?${params}`);
			if (response.ok) {
				const data = await response.json();
				$session = {
					...$session,
					...data
				};
				goto('/');
			}
		}
	});
</script>

{#if $session.user}
	<Media />
{:else}
	<p>You need to login using <a href="auth/login">discord</a> in order to view any tracks</p>
{/if}

<style>
	:global(table tr.active) {
		background: var(--gray-light);
	}
</style>

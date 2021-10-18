<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		return {
			status: 200
		};
	}
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import Media from '$lib/Media.svelte';
</script>

<Media />

<style>
	:global(table tr.active) {
		background: var(--gray-light);
	}
</style>

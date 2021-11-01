<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ session }) {
		if (!session.user?.roles?.length) {
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
	import Media from '$lib/Media.svelte';
</script>

<Media />

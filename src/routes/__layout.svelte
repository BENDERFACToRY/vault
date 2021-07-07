<script context="module">
	import { token } from '$lib/graphql';

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, session }) {
		if (session.token) {
			token.set(session.token);
		} else if (page.path.startsWith('/u')) {
			return {
				status: 302,
				redirect: '/'
			};
		} else {
			token.set(null);
		}

		return {};
	}
</script>

<script lang="ts">
	import { session } from '$app/stores';

	import Player from '$lib/Player.svelte';

	import '../app.css';
</script>

<svelte:head>
	<title>Vault</title>
</svelte:head>

<header>
	<a href="/">
		<img src="/logo.png" alt="Logo" />
	</a>

	<h1>Vault</h1>

	{#if $session.user}
		<a href="/auth/logout">Logout</a>
		<a href="/u/{$session.user.name.toLowerCase()}">{$session.user.name}</a>
	{:else}
		<a href="/auth/login">Login</a>
	{/if}
</header>

<slot />

<footer>
	<Player />
</footer>

<style>
	header {
		display: flex;

		height: 5rem;
		padding: calc(5px + env(safe-area-inset-top)) calc(5px + env(safe-area-inset-right)) 5px
			calc(5px + env(safe-area-inset-left));
		margin: -8px;

		background: var(--gray);
		border-bottom: 5px solid var(--black);
	}

	footer {
		position: sticky;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	img {
		height: 5rem;
	}

	h1 {
		margin: 0;
		font-size: 4rem;
		margin-left: 1rem;
	}

	pre {
		display: block;
		overflow: auto;
		font-size: 5px;
	}
</style>

<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, session }) {
		const { token, client } = createClient();

		if (session.token) {
			token.set(session.token);
		} else if (page.path.startsWith('/u')) {
			return {
				status: 302,
				redirect: '/'
			};
		} else {
			console.log('Load layout -> set token null');
			token.set(null);
		}

		return {
			context: {
				token,
				client
			},
			props: {
				client,
				token
			}
		};
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { session } from '$app/stores';
	import { setClient } from 'svelte-apollo';

	import Player from '$lib/Player.svelte';
	import { createClient } from '$lib/graphql';

	import '../app.css';

	export let client;
	export let token;

	setClient(client);
	setContext('token', token);
</script>

<svelte:head>
	<title>Vault</title>
</svelte:head>

<header>
	<a href="/">
		<img src="/logo.png" alt="Logo" />
	</a>

	<h1>Vault</h1>

	<nav>
		{#if $session.user}
			<a href="/auth/logout">Logout</a>
			<a href="/u/{$session.user.name.toLowerCase()}">{$session.user.name}</a>
		{:else}
			<a href="/auth/login">Login</a>
		{/if}
	</nav>
</header>

<slot />

<footer>
	<Player />
</footer>

<style>
	nav {
		flex: 1;
		display: flex;
		justify-content: end;
	}
	nav a {
		align-self: flex-end;
		padding: 0.5rem;
		margin: 0.5rem;
		margin-bottom: -5px;
		background: var(--gray-light);
	}
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
</style>

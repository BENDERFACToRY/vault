<script lang="ts">
	import { goto } from '$app/navigation';
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
	<a href="/auth">Login</a>
	<pre>{JSON.stringify($session)}</pre>
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
</style>

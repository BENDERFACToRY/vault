<script lang="ts">
	import { onMount } from 'svelte';
	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';

	onMount(async () => {
		if ($page.query.has('code') && $page.query.has('state')) {
			// it's an oauth redirect call.
			// Resolve the token and redirect the user to a clean url
			const params = new URLSearchParams({
				code: $page.query.get('code'),
				state: $page.query.get('state')
			});

			const response = await fetch(`/auth/token?${params}`);
			if (response.ok) {
				const data = await response.json();
				console.log('Got data:', data);
				$session = {
					...$session,
					...data
				};

				// Removing the code and state from the url
				goto('/login', { replaceState: true });
			}
		}

		if (!$session.user.rolesOnDiscord) {
			refresh();
		}

		if (!$session.user.rolesOnDiscord?.includes('VCA')) {
			refresh();
		}

		if ($session.user?.roles?.length) {
			console.log('Has session -> Login', $session.user);
			// User is logged in
			goto('/', { replaceState: true });
		}
	});

	const refresh = async () => {
		const response = await fetch('/auth/token?refresh');
		console.log('refresh ->', response.status);
		const data = await response.json();

		$session = {
			...$session,
			...data
		};
		console.log('data:', data);
	};
</script>

{#if $page.query.has('code') && $page.query.has('state')}
	<h1>Please wait,</h1>
	<p>we're logging you in.</p>
{:else if !$session.user}
	<h1>Welcome!</h1>
	<p>Login on <a href="auth/login" rel="external">discord</a> to get access to the vault.</p>
{:else if !$session.user.rolesOnDiscord}
	<h1>Weird,</h1>
	<p>
		it seems you still have to get on the <a href="https://discord.gg/3QZUz7TKeS" target="_blank"
			>ModularMayham discord</a
		>
	</p>
	<p>If you just did, please <button on:click={refresh}>click here</button> or refresh</p>
{:else if !$session.user.rolesOnDiscord?.includes('VCA')}
	<h1>Final step is to get into the VCA game!</h1>

	<p>
		<b>Step 1</b> head on over to <a href="https://rally.io/">https://rally.io/</a> and click the
		"create an account" button. <br />
		Follow the steps there, it will guide you through the account creation process.<br />
		Go to your settings page and connect discord to your rally account.
	</p>

	<p>
		<b>Step 2</b> Getting some VCA!
	</p>

	<p>
		<b>Step 3</b>
		Brace for funky times! <br />
		type "!coin join" in the
		<a href="https://discord.com/channels/690169153750958091/698470600209072149/">🤖bot-commands</a>
		channel for your VCA role!
	</p>

	<p>
		<b>Step 4</b>
		<button on:click={refresh}>click here</button> to refresh
	</p>
	<p>
		<b>Need help?</b><br />
		Head over to #vca-help and we'll look into it!
	</p>
	<p>
		<b>More info on how it all works can be found here</b><br />
		<a href="https://rally.io/faq/#fans">https://rally.io/faq/#fans</a>
	</p>
{/if}

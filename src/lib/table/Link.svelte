<script lang="ts">
	export let href;
	export let text;
</script>

<a sveltekit:prefetch {href}>{text}</a>

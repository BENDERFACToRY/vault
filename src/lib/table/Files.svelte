<script lang="ts">
	export let basepath;

	export let flac;
	export let flac_bytes;
	export let vorbis;
	export let ogg_bytes;
	export let mp3;
	export let mp3_bytes;
	// export let id;
	// export let name;
	// export let patch_notes;
	// export let ondisk_root;
	// export let media_info;

	const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
	const getBytes = (bytes) => {
		let index = 0;
		while (bytes >= 1024 && index < sizes.length) {
			bytes /= 1024;
			index++;
		}
		return bytes.toFixed(1) + ' ' + sizes[index];
	};

	$: files = [
		flac && { label: 'FLAC', href: `${basepath}/${flac}`, bytes: getBytes(flac_bytes) },
		vorbis && { label: 'OGG', href: `${basepath}/${vorbis}`, bytes: getBytes(ogg_bytes) },
		mp3 && { label: 'MP3', href: `${basepath}/${mp3}`, bytes: getBytes(mp3_bytes) }
	].filter((f) => !!f);
</script>

{#each files as { label, href, bytes }}
	<span>
		<a {href}>{label}</a>
		{bytes}
	</span>
{/each}

<style>
	span {
		line-height: 1.5rem;
	}
	span + span {
		border-left: thin solid var(--black);
		padding: 0 5px;
		margin: 5px 0;
	}
</style>

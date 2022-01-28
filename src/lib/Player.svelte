<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface StereoMix {
		vorbis: string;
		mp3?: string;
	}

	interface Track {
		title: string;
		data_folder: string;
		stereo_mix: StereoMix;
		isPlaying: boolean;
	}

	export const currentTrack = writable<Track>();
</script>

<script lang="ts">
	let time = 0;
	let maxTime = 0;
	let formattedElapsed = '-';
	let formattedDuration = '-';
	let controller: AbortController;
	let previousTrack: Track;

	let canvas: HTMLCanvasElement;
	let audioContext: AudioContext;
	let source: MediaElementAudioSourceNode;
	let audioElement: HTMLAudioElement;

	const autoplay = (audio: HTMLAudioElement, current: Track) => {
		audioElement = audio;
		audio.crossOrigin = 'anonymous';
		const play = async (track: Track) => {
			if (track == previousTrack) {
				if (!track.isPlaying) {
					audio.pause();
				} else {
					await audio.play();
				}

				return;
			}
			controller?.abort();
			if (track) {
				audio.load();
				await audio.play();

				// This will need to be replaced with non-existant api to get audio buffer from element… or better yet pre-computed values.
				controller = new AbortController();
				fetch(audio.currentSrc, { signal: controller.signal })
					.then((response) => response.arrayBuffer())
					.then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
					.then((audioBuffer) => draw(normalizeData(filterData(audioBuffer))));
			}

			previousTrack = track;
		};

		audio.addEventListener('timeupdate', function () {
			const currentTime = Math.floor(audio.currentTime);
			if (time != currentTime) {
				time = currentTime;
				formattedElapsed = formatTimespan(currentTime);
			}
		});
		audio.addEventListener('loadedmetadata', function () {
			maxTime = Math.floor(audio.duration);
			formattedDuration = formatTimespan(maxTime);
		});
		audio.addEventListener('play', () => {
			// $currentTrack.isPlaying = true;
			audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
			source = source || audioContext.createMediaElementSource(audio);

			source.connect(audioContext.destination);
		});

		const filterData = (audioBuffer: AudioBuffer): number[] => {
			const rawData = audioBuffer.getChannelData(0);
			const samples = Math.floor(canvas.offsetWidth / 5);
			const blockSize = Math.floor(rawData.length / samples);
			const filteredData: number[] = [];
			for (let i = 0; i < samples; i++) {
				let blockStart = blockSize * i;
				let sum = 0;
				for (let j = 0; j < blockSize; j++) {
					sum = sum + Math.abs(rawData[blockStart + j]);
				}
				filteredData.push(sum / blockSize);
			}

			return filteredData;
		};

		const normalizeData = (filteredData: number[]): number[] => {
			const multiplier = Math.pow(Math.max(...filteredData), -1);

			return filteredData.map((n) => n * multiplier);
		};

		const draw = (normalizedData: number[]) => {
			// setup
			const dpr = window.devicePixelRatio || 1;
			const padding = 0;
			canvas.width = canvas.offsetWidth * dpr;
			canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
			const ctx = canvas.getContext('2d');
			ctx.scale(dpr, dpr);

			// reset
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.translate(0, canvas.offsetHeight / 2 + padding);

			// draw the segments
			const width = canvas.offsetWidth / normalizedData.length;
			for (let i = 0; i < normalizedData.length; i++) {
				const x = width * i;
				let height = normalizedData[i] * canvas.offsetHeight - padding;
				if (height < 0) {
					height = 0;
				} else if (height > canvas.offsetHeight / 2) {
					height = canvas.offsetHeight / 2;
				}
				drawLineSegment(ctx, x, height, width);
			}
		};

		const drawLineSegment = (
			ctx: CanvasRenderingContext2D,
			x: number,
			height: number,
			width: number
		) => {
			// skew
			const dpr = window.devicePixelRatio || 1;
			const origx = 10;
			const origy = 30 * dpr;
			const rotation = 0;
			const skewx = 10;
			const skewy = 0;
			const scalex = 0.95 * dpr;
			const scaley = 1 * dpr;
			const anglex = rotation + skewy;
			const angley = rotation + skewx;
			const rx = (Math.PI * anglex) / 180;
			const ry = (Math.PI * angley) / 180;
			ctx.setTransform(
				scalex * Math.cos(rx),
				scalex * Math.sin(rx),
				-scaley * Math.sin(ry),
				scaley * Math.cos(ry),
				origx,
				origy
			);

			// background gutters
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#eee';
			ctx.beginPath();
			ctx.moveTo(x, -canvas.offsetHeight / 2);
			ctx.lineTo(x, canvas.offsetHeight / 2);
			ctx.closePath();
			ctx.stroke();

			// analysed sound
			ctx.strokeStyle = '#000';
			// ctx.strokeStyle = '#ccc';
			ctx.beginPath();
			ctx.moveTo(x, -1 * height);
			ctx.lineTo(x, height);
			ctx.closePath();
			ctx.stroke();

			// played
			// ctx.strokeStyle = '#000';
			// ctx.beginPath();
			// ctx.moveTo(x, -1 * height);
			// ctx.lineTo(x, height);
			// ctx.closePath();
			// ctx.stroke();
		};

		function formatTimespan(time: number): string {
			const minuteValue = Math.floor(time / 60);
			const minutes = minuteValue.toString().padStart(2, '0');
			const secondValue = time - minuteValue * 60;
			const seconds = secondValue.toString().padStart(2, '0');

			return `${minutes}:${seconds}`;
		}

		play(current);

		return {
			update: play
		};
	};

	function handlePlay() {
		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}

		if ($currentTrack.isPlaying) {
			audioElement.pause();
			$currentTrack.isPlaying = false;
		} else {
			audioElement.play();
			$currentTrack.isPlaying = true;
		}
	}

	function changeSeek(e: { target: HTMLInputElement }) {
		audioElement.currentTime = parseInt(e.target.value);
	}

	$: {
		console.log($currentTrack);
	}

	$: baseSrc = $currentTrack && `https://ipfs.benderfactory.com/${$currentTrack.data_folder}`;
	$: vorbis =
		baseSrc && $currentTrack.stereo_mix.vorbis && `${baseSrc}/${$currentTrack.stereo_mix.vorbis}`;
	$: mp3 = baseSrc && $currentTrack.stereo_mix.mp3 && `${baseSrc}/${$currentTrack.stereo_mix.mp3}`;
</script>

{#if $currentTrack}
	<article>
		<audio use:autoplay={$currentTrack} preload="metadata">
			<track kind="captions" src="data:%5b%e2%99%ab music %e2%99%ab%5d" />

			{#if vorbis}
				<source src={vorbis} type="audio/ogg; codecs=vorbis" />
			{/if}

			{#if mp3}
				<source src={mp3} type="audio/mpeg" />
			{/if}

			Your browser does not support the <code>audio</code> element.
		</audio>
		<div class="controls">
			<div>
				<button id="play" class="icon" on:click={handlePlay}>
					{#if $currentTrack.isPlaying}
						pause
					{:else}
						play_arrow
					{/if}
				</button>
			</div>
			<div class="seek">
				<span>{$currentTrack.title}</span>
				<canvas bind:this={canvas} />
				<input id="seek" type="range" on:change={changeSeek} value={time} max={maxTime} />
			</div>
			<div class="duration">{formattedElapsed}/{formattedDuration}</div>
		</div>
	</article>
{/if}

<style>
	article {
		width: 100%;
		height: 64px;
		background-color: var(--gray-light);
		padding-bottom: env(safe-area-inset-bottom);
		padding-left: env(safe-area-inset-left);
		padding-right: env(safe-area-inset-right);
	}

	.controls {
		display: grid;
		grid-template-columns: 64px 1fr 128px;
		width: 100%;
		height: 64px;
	}

	button {
		margin: 4px;
		padding: 0;
		width: 56px;
		height: 56px;
	}

	.seek {
		position: relative;
	}

	span {
		background-color: rgba(255, 255, 255, 0.9);
		color: var(--black);
		display: inline;
		z-index: 200;
		position: absolute;
		user-select: none;
		top: 8px;
		left: 8px;
		max-width: calc(100% - 8px);
		height: 1em;
		line-height: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	canvas {
		position: absolute;
		width: 100%;
		height: 56px;
		margin: 4px;
		z-index: 1;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		height: 100%;
		width: 100%;
		margin: 0;
		background-color: transparent;
		border: none;
		z-index: 10;
		position: absolute;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		background-color: black;
		display: block;
		width: 16px;
		height: 16px;
		margin-top: 38px;
		border-radius: 50%;
	}

	.duration {
		padding: 8px;
	}
</style>

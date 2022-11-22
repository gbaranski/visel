<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		console.log('mounted');
		const ctx = canvas.getContext('2d')!;
		const img = new Image();
		img.addEventListener(
			'load',
			() => {
                canvas.width = img.width;
                canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				ctx.beginPath();
				ctx.moveTo(30, 96);
				ctx.lineTo(70, 66);
				ctx.lineTo(103, 76);
				ctx.lineTo(170, 15);
				ctx.stroke();
			},
			false
		);
		img.addEventListener('error', console.error);
		img.src = `/api/capture?src=${encodeURIComponent(data.src!)}`;
	});
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		width: 100%;
		height: 100%;
		background-color: #666;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let canvas: HTMLCanvasElement;
    let image: HTMLImageElement | null = null;

	onMount(() => {
		console.log('mounted');
		const ctx = canvas.getContext('2d')!;
        image = new Image();
		image.addEventListener(
			'load',
			() => {
				canvas.width = image!.width;
				canvas.height = image!.height;
				ctx.drawImage(image!, 0, 0);
			},
			false
		);
		image.addEventListener('error', console.error);
		image.src = `/api/capture?src=${encodeURIComponent(data.src!)}`;
	});

	const clicks: { x: number; y: number }[] = [];

	const drawPolygon = () => {
		const ctx = canvas.getContext('2d')!;
		ctx.fillStyle = 'rgba(100,100,100,0.5)';
		ctx.strokeStyle = '#df4b26';
		ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.moveTo(clicks[0].x, clicks[0].y);
		for (var i = 1; i < clicks.length; i++) {
			ctx.lineTo(clicks[i].x, clicks[i].y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	};

	const drawPoints = () => {
		const ctx = canvas.getContext('2d')!;
		ctx.strokeStyle = '#df4b26';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 5;

		for (var i = 0; i < clicks.length; i++) {
			ctx.beginPath();
			ctx.arc(clicks[i].x, clicks[i].y, 3, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#ffffff';
			ctx.fill();
			ctx.lineWidth = 5;
			ctx.stroke();
		}
	};

	const redraw = () => {
		const ctx = canvas.getContext('2d')!;
		canvas.width = canvas.width; // Clears the canvas
		ctx.drawImage(image!, 0, 0);

		drawPolygon();
		drawPoints();
	};

	const onMouseUp = (e: MouseEvent) => {
        clicks.push({
            x: e.offsetX,
            y: e.offsetY,
        });
        redraw();
	};
</script>

<canvas bind:this={canvas} on:mouseup={onMouseUp} width="600" height="400" ></canvas>

<style>
	canvas {
        background: #fff;
        display: block;
        margin:20px auto;
	}
</style>

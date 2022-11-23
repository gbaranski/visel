<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
    let image: HTMLImageElement | null = null;

	onMount(() => {
		console.log('mounted');
        ctx = canvas.getContext('2d')!;
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

	let clicks: { x: number; y: number }[] = [];
    let polygons: { x: number; y: number }[][] = [];

	const drawPolygon = () => {
		ctx.fillStyle = 'rgba(100,100,100,0.5)';
		ctx.strokeStyle = '#df4b26';
		ctx.lineWidth = 1;

        if(clicks.length > 1) {
            ctx.beginPath();
            ctx.moveTo(clicks[0].x, clicks[0].y);
            for (var i = 1; i < clicks.length; i++) {
                ctx.lineTo(clicks[i].x, clicks[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        polygons.forEach((points) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
        
	};

	const drawPoints = () => {
		ctx.strokeStyle = '#df4b26';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 5;

        console.log({clicks});
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
        console.log("redraw");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(image!, 0, 0);

		drawPolygon();
		drawPoints();
	};

	const onClick = (e: MouseEvent) => {
        clicks.push({
            x: e.offsetX,
            y: e.offsetY,
        });
        redraw();
	};
    
    const onKeypress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            polygons = [...polygons, clicks];
            clicks = [];
            redraw();
        }
    }

</script>

<canvas bind:this={canvas} on:mouseup={onClick} on:keypress={onKeypress} tabindex="0" width="600" height="400" ></canvas>
{#each polygons as points}
    <p>- points: [{#each points as point} [{point.x}, {point.y}]{/each}]</p>
{/each}

<style>
	canvas {
        background: #fff;
        display: block;
        margin:20px auto;
	}
</style>

<script lang="ts">
    export let roomCode: string;
    let movie: any = null;
</script>

{#if movie}
<div class="text-center text-sm border-2">
    {movie}
</div>
{/if}
<form action={`/${roomCode}/movieUpload`} method="post" enctype="multipart/form-data" class="flex items-center justify-center gap-4">
    <div class="flex gap-2">
        <div class="relative">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label for="movie" class="btn btn-accent btn-sm w-full cursor-pointer text-center p-2 rounded-sm">
                Load Movie
            </label>
            <input type="file" accept="video/*" name="movie" id="movie" class="hidden" bind:value={movie} on:change={print}>
        </div>
        <div class="relative">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label for="subtitle" class="btn btn-info btn-sm w-full cursor-pointer text-center p-2 rounded-sm">
                Load Subtitle
            </label>
            <!-- <input type="file" name="subtitle" id="subtitle" accept=".srt,.vtt,.sub,.smi,.sami,.ttml,.ass,.ssa" class="hidden"> -->
        </div></div>
    <button type="submit" class="btn btn-neutral btn-sm">Load</button>
</form>
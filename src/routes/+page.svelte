<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";

    let inputfile: HTMLInputElement;

    const removeSpaces = () => {
        inputfile.value = inputfile.value.replace(/\s/g, '');
    }
</script>

<div class="flex flex-col md:flex-row w-screen h-screen">
    <div
        class="flex flex-col items-center justify-center text-center gap-2 p-3 h-2/6 md:h-full w-full md:w-1/2 bg-success"
    >
        <img src="/tab.png" alt="logo" class="w-52">
        <h1 class="text-3xl font-bold text-base-100 font-serif">
            Watch Em Togetha
        </h1>
        <h1 class="text-sm">Share and Watch Movies together</h1>
    </div>
    <div
        class="flex flex-col gap-4 items-center justify-center h-4/6 md:h-full w-full md:w-1/2 p-2"
    >
        <div class="flex flex-col gap-2 items-center justify-center">
            <h1 class="text-center text-lg">
                Create New Room Simply with a Random Room Name
            </h1>
            <h1 class="text-center text-xs">
                Or Enter an Existing Room with an Existing Room Name
            </h1>
        </div>
        <div>
            <form
                action="?/room"
                method="post"
                class="flex flex-col md:flex-row h-full gap-2 items-center justify-center"
            >
                <input
                    type="text"
                    name="roomCode"
                    placeholder="room code"
                    class="input input-bordered rounded-none input-sm md:input-md"
                    pattern="[^ ]*"
                    on:input={removeSpaces}
                    required
                    bind:this={inputfile}
                />
                <Button type="submit" class="rounded-sm">Enter</Button>
            </form>
        </div>
    </div>
</div>

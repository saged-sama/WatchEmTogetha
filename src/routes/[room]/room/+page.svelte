<script lang="ts">
    import ChatBox from "$lib/components/room/ChatBox.svelte";
    import Movie from "$lib/components/room/Movie.svelte";
    import MovieUpload from "$lib/components/room/MovieUpload.svelte";

    export let data: any;

    const { nickname, roomCode } = data;
</script>

<div class="flex md:flex-row flex-col w-screen h-screen gap-2 p-1">
    <div
        class="flex flex-col gap-2 items-center justify-center w-full md:w-3/4 h-1/3 md:h-full"
    >
        <div
            class="flex items-center justify-center w-full md:h-5/6 bg-accent rounded-lg"
        >
            <Movie roomCode={roomCode} />
        </div>
        <div class="flex flex-col gap-2 items-center justify-center w-full md:h-1/6">
            <MovieUpload {roomCode} />
        </div>
    </div>
    <div class="md:w-1/4 w-full h-2/3 md:h-full">
        <ChatBox {roomCode} participant={nickname} />
    </div>
</div>

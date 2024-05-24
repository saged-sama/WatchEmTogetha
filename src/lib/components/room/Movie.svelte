<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { Cookie } from "lucide-svelte";
    import { onDestroy, onMount } from "svelte";

    export let roomCode: string;
    let movie: string | null = null;
    let isPlaying: boolean = false;
    let playbacktime: number = 0;
    let videoPlayer: HTMLVideoElement | null = null;
    let realtime: any;
    let ignoreEvent = false;

    const getMovie = async () => {
        const { data, error } = await supabase
            .from("rooms")
            .select("movie, isPlaying, playbacktime")
            .eq("roomCode", roomCode);
        if (error) {
            throw error;
        }
        movie = data[0].movie;
        isPlaying = data[0].isPlaying;
        playbacktime = data[0].playbacktime;

        if (videoPlayer && movie && movie !== "") {
            videoPlayer.currentTime = playbacktime || 0;
            if (isPlaying) {
                videoPlayer.play();
            } else {
                videoPlayer.pause();
            }
        }
    };

    const handleUpdate = (payload: any) => {
        if (ignoreEvent) return;

        if (movie !== payload.new.movie) {
            movie = payload.new.movie;
        }
        if (isPlaying !== payload.new.isPlaying) {
            isPlaying = payload.new.isPlaying;
            if (isPlaying) {
                videoPlayer?.play();
            } else {
                videoPlayer?.pause();
                playbacktime = payload.new.playbacktime;
                if (videoPlayer) videoPlayer.currentTime = playbacktime;
            }
        }
        if (Math.abs(playbacktime - payload.new.playbacktime) >= 2) {
            playbacktime = payload.new.playbacktime;
            if (videoPlayer) videoPlayer.currentTime = playbacktime;
        }
    };

    const handlePlay = async () => {
        ignoreEvent = true;
        isPlaying = true;
        playbacktime = videoPlayer?.currentTime || 0;
        const { error } = await supabase
            .from("rooms")
            .update({
                isPlaying: isPlaying,
            })
            .eq("roomCode", roomCode);
        if (error) {
            throw error;
        }
        ignoreEvent = false;
    };

    const handlePause = async () => {
        ignoreEvent = true;
        isPlaying = false;
        playbacktime = videoPlayer?.currentTime || 0;
        const { error } = await supabase
            .from("rooms")
            .update({
                isPlaying: isPlaying,
                playbacktime: playbacktime,
            })
            .eq("roomCode", roomCode);
        if (error) {
            throw error;
        }
        ignoreEvent = false;
    };

    const handleSeeked = async () => {
        ignoreEvent = true;
        playbacktime = videoPlayer?.currentTime || 0;
        const { error } = await supabase
            .from("rooms")
            .update({
                playbacktime: playbacktime,
            })
            .eq("roomCode", roomCode);
        if (error) {
            throw error;
        }
        ignoreEvent = false;
    };

    onMount(() => {
        if (videoPlayer) {
            videoPlayer.addEventListener("play", handlePlay);
            videoPlayer.addEventListener("pause", handlePause);
            videoPlayer.addEventListener("seeked", handleSeeked);
        }

        getMovie();
        realtime = supabase.channel(roomCode).on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "rooms",
                filter: `roomCode=eq.${roomCode}`,
            },
            handleUpdate,
        );
        realtime.subscribe();

        return () => {
            realtime.unsubscribe();
        };
    });

    onDestroy(() => {
        videoPlayer?.pause();
        if (videoPlayer) {
            videoPlayer.removeEventListener("play", handlePlay);
            videoPlayer.removeEventListener("pause", handlePause);
            videoPlayer.removeEventListener("seeked", handleSeeked);
        }
    });
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
    width="1000"
    bind:this={videoPlayer}
    class="max-h-full rounded-xl"
    controls
>
    {#if movie && movie !== ""}
        <source src={movie} />
    {/if}
</video>

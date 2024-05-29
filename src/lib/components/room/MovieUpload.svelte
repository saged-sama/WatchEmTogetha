<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { storage } from "$lib/firebase";
    import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

    export let roomCode: string;
    let movie: File | undefined;
    let movieExt: string | undefined;
    let uploading: boolean = false;

    const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            movie = input.files[0];
            movieExt = movie.name.split(".").pop();
        }
    };

    const uploadMovie = async () => {
        if (!movie || !movieExt) {
            alert("Please select a movie first.");
            return;
        }

        try {
            uploading = true;

            const storageRef = ref(storage, `movies/${roomCode}.${movieExt}`);
            const uploadTask = uploadBytesResumable(storageRef, movie);

            uploadTask.on('state_changed', 
                (snapshot) => {
                }, 
                (error) => {
                    console.error("Upload failed:", error);
                    alert("An error occurred while uploading the movie.");
                    uploading = false;
                }, 
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);

                    const { error: updateError } = await supabase
                        .from("rooms")
                        .update({
                            movie: downloadURL,
                            isPlaying: false,
                            playbacktime: 0,
                        })
                        .eq("roomCode", roomCode);

                    if (updateError) {
                        throw updateError;
                    }

                    movie = undefined;
                    uploading = false;
                }
            );
        } catch (error) {
            console.error("Error uploading movie:", error);
            alert("An error occurred while uploading the movie.");
            uploading = false;
        }
    };
</script>

{#if movie}
    <div class="text-center text-sm border-2">
        {movie.name}
    </div>
{/if}
<div class="flex items-center justify-center gap-4">
    <div class="flex gap-2">
        <div class="relative">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label
                for="movie"
                class="btn btn-accent btn-sm w-full cursor-pointer text-center p-2 rounded-sm"
            >
                Load Movie
            </label>
            <input
                type="file"
                accept="video/*, video/x-matroska, video/webm"
                name="movie"
                id="movie"
                class="hidden"
                on:change={handleFileChange}
            />
        </div>
    </div>
    <div class="flex gap-1 items-center justify-center">
        <button class="btn btn-neutral btn-sm" on:click={uploadMovie}
            >Load</button
        >
        {#if uploading}
            <span class="loading loading-bars loading-xs"></span>
        {/if}
    </div>
</div>

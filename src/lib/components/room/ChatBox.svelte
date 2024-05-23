<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { Menu, Send } from "lucide-svelte";
    import { onMount } from "svelte";

    export let roomCode: string;
    export let participant: string;
    let realtime: any;
    let messages: any[] = [];
    let message: string;

    const getMessages = async () => {
        if (message === "") {
            return;
        }
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("roomCode", roomCode)
            .order("created_at", { ascending: false });
        if (error) {
            throw error;
        }
        messages = [...data];
    };

    const sendMessage = async () => {
        const { error } = await supabase.from("messages").insert({
            message: message,
            roomCode: roomCode,
            sender: participant,
        });
        if (error) {
            throw error;
        }
        message = "";
    };

    onMount(() => {
        getMessages();
        realtime = supabase.channel(roomCode + participant).on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `roomCode=eq.${roomCode}`,
            },
            handleUpdate,
        );
        realtime.subscribe();

        return () => {
            realtime.unsubscribe();
        };
    });

    const handleUpdate = async (payload: any) => {
        // console.log(payload.new);
        messages = [...messages, payload.new].sort((a, b) =>
            b.created_at.localeCompare(a.created_at),
        );
    };
</script>

<div
    class="flex flex-col w-full h-full items-center justify-center border-t-2 md:border-2 rounded-md p-1 gap-2"
>
    <div class="flex items-center justify-between w-full p-1">
        <h1 class="text-xl font-serif">Chat</h1>
        <details class="dropdown dropdown-end">
            <summary class="m-1 btn"><Menu class="w-4 h-4"/></summary>
            <div
                class="flex flex-col gap-2 p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
            >
                <!-- <li> -->
                    <form action={`/${roomCode}/destroy`} method="post" class="w-full p-1 bg-base-200 rounded-md hover:text-warning">
                        <button type="submit" class="w-full">Destroy Room</button>
                    </form>
                <!-- </li> -->
                <!-- <li> -->
                    <form action={`/${roomCode}/leaveRoom`} method="post" class="w-full p-1 bg-base-200 rounded-md hover:text-warning">
                        <input type="text" value={participant} class="hidden" name="nickname">
                        <button type="submit" class="w-full text-error hover:text-warning">Leave Room</button>
                    </form>
                <!-- </li> -->
                </div>
        </details>
    </div>
    <div
        class="flex flex-col-reverse w-full h-full overflow-y-auto bg-accent rounded-lg border-2"
    >
        {#if messages}
            {#each messages as message}
                {#if message.sender === participant}
                    <div class="chat chat-end">
                        <div class="chat-bubble">
                            <div class="chat-header text-info">
                                {message.sender}
                            </div>
                            <div>
                                {message.message}
                            </div>
                        </div>
                    </div>
                {:else}
                    <div class="chat chat-start">
                        <div
                            class="chat-bubble bg-base-100 text-neutral border-2"
                        >
                            <div class="chat-header text-success">
                                {message.sender}
                            </div>
                            <div>
                                {message.message}
                            </div>
                        </div>
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
    <div class="w-full">
        <form on:submit={sendMessage}>
            <label
                class="input input-bordered rounded-sm flex items-center gap-2"
            >
                <input
                    type="text"
                    class="grow"
                    bind:value={message}
                    placeholder="Type a Message..."
                />
                <button type="submit"
                    ><Send class="w-4 h-4 hover:w-5 hover:h-5" /></button
                >
            </label>
        </form>
    </div>
</div>

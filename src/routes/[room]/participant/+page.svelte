<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let modal: any;
  let roomCode: string;

  onMount(() => {
    modal?.showModal();
    const url = $page.url.toString().split("/");
    roomCode = url[url.length - 2];
  });
</script>

<div
  class="flex flex-col items-center justify-center text-center gap-2 p-3 min-h-screen w-full bg-success"
>
  <img src="/tab.png" alt="logo" class="w-52" />
  <h1 class="text-3xl font-bold text-base-100 font-serif">Watch Em Togetha</h1>
  <h1 class="text-sm">Share and Watch Movies together</h1>
</div>

<dialog bind:this={modal} class="rounded-sm modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">{roomCode}</h3>
    <p class="py-4">Give yourself a suitable Nickname for the Group</p>
    <div class="modal-action">
      <form action="?/addparticipant" method="post">
        <input
          type="text"
          name="nickname"
          placeholder="nickname"
          class="input input-md input-accent md:w-96 rounded-sm"
        />
        <Button type="submit" class="rounded-sm">Enter</Button>
      </form>
    </div>
  </div>
</dialog>

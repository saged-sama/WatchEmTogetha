<script>
    import Button from "$lib/components/ui/button/button.svelte";
</script>

<form action="?/fileupload" method="post" enctype="multipart/form-data">
    <input type="file" accept="video/*" name="file" class="file-input file-input-accent file-input-sm">
    <Button type="submit">Upload</Button>
</form>
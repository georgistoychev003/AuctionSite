<script>
    import { onMount } from 'svelte';
    import AddArtworkForm from "../components/AddArtworkForm.svelte";

    let showGuidelines;

    onMount(async () => {
        if (!localStorage.getItem('guidelinesSeen')) {
            showGuidelines = true;
        }
    });
</script>

<div>
    <AddArtworkForm {showGuidelines} />
</div>


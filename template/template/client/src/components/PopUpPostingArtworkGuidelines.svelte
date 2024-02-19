
<script>

    //This is component is a pop up that shows the guidelines when trying yo post an artwork
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }
</script>

<div class="guidelines">
    <div class="content">
        <h2>Artwork Posting Guidelines</h2>
        <ul>
            <li>Name: String (at least 1 character long)</li>
            <li>Type: One of ["painting", "sculpture", "portrait", "digital art", "child drawing", "landscape"]</li>
            <li>Artist Name: String (at least 1 character long)</li>
            <li>Description: String (at least 4 characters long)</li>
            <li>Authenticity: "yes" or "no"</li>
            <li>Starting Price: Numeric without symbols and minimum of 1</li>
            <li>Image: Valid URL</li>
            <li>Color: One of ["multicolor", "blue", "yellow", "purple", "black", "white", "red", "green", "grey", "metallic", "gold", "brown"]</li>
        </ul>
        <button on:click={close}>Close</button>
    </div>
</div>

<style>
    .guidelines {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content {
        background: white;
        padding: 2rem;
        width: 80%;
        max-width: 500px;
        border-radius: 8px;
    }
</style>

<script>
    import { createEventDispatcher } from 'svelte';

   let searchQuery = "";

   const dispatch = createEventDispatcher();

   function handleSearch() {
       dispatch('search', {
           query: searchQuery
       });
   }

</script>

<div class="search-bar">
    <input bind:value={searchQuery} placeholder="Search artworks..." />
    <button on:click={handleSearch}>Search</button>

</div>

<style>
    .search-bar {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;

    }
    button {
        margin-top: 10px;
        padding: 10px 15px;
        background-color: #cebf00;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>
<script>

    import page from "page";


    import Filter from "../components/Filter.svelte";
    import Search from "../components/Search.svelte";
    import ArtworkBox from "../components/ArtworkBox.svelte";
    import {onMount} from "svelte";
    let items = []; // empty array to store my artworks
    let isLoading=true; //variable to control the display of the loading of my Loading GIF

    const loadingGifUrl = "./src/assets/loading.gif"; // Loading GIF
    const backgroundUrl = "./src/assets/gif.gif"; //backround GIF

    let contentStyle = `background-image: url(${backgroundUrl})`;
    let loadingStyle = `background-image: url(${loadingGifUrl})`;

    function showDetails(artworkId) {
        console.log("click");

        page(`/artworkdetails/${artworkId}`);
    }

    function applySearch(event) {
        if (event.detail.query === "") {
            items = allItems;
            return;
        }

        items = allItems.filter(artwork =>
            artwork.title.toLowerCase().includes(event.detail.query.toLowerCase())
        );
    }



    let filters = {
        color: "",
        price: "",
        type: ""
    };



    let allItems = []; // stores all artworks fetched from the backend (unchanged aka no filters)

    async function applyFilter() {
        const queryParams = new URLSearchParams();

        if (filters.color) {
            queryParams.append('color', filters.color);
        }

        if (filters.type) {
            queryParams.append('type', filters.type);
        }

        if (filters.price) {
            queryParams.append('price', filters.price);
        }

        try {
            const response = await fetch(`http://localhost:3000/artworks?${queryParams}`);
            const data = await response.json();
            items = data.map(artwork => ({
                id: artwork.id,
                title: artwork.name,
                artist: artwork.artistName,
                type: artwork.type,
                color: artwork.color,
                price: artwork.startingPrice,
                url: artwork.image
            }));
        } catch (error) {
            console.error("Error fetching artworks:", error);
        }
    }


    // Fetch artworks from the backend when the component is loaded
    onMount(async () => {
        setTimeout(async () => {
            isLoading = false;
            try {
                const response = await fetch('http://localhost:3000/artworks');
                const data = await response.json();
                allItems = data.map(artwork => ({
                    id: artwork.id,
                    title: artwork.name,
                    artist: artwork.artistName,
                    type: artwork.type,
                    color: artwork.color,
                    price: artwork.startingPrice,
                    url: artwork.image
                }));
                items = [...allItems]; // This line ensures that all artworks are shown when the home page is loaded
            } catch (error) {
                console.error("Error fetching artworks:", error);
            }
        }, 1000);
    });


</script>

<body>
<!-- Search Bar -->
<Search on:search={applySearch}/>

<!-- Loading GIF -->
{#if isLoading}
    <div class="loading-gif" style={loadingStyle}></div>
{:else}
    <!-- Main content -->
    <div class="content" style={contentStyle}>
        <!-- Filter Bar -->
        <Filter bind:filters on:change={applyFilter}/>
        <!-- Artworks List -->
        <main class="artworks-list">
            {#each items as artwork}
                <ArtworkBox {artwork} {showDetails}/>
            {/each}
        </main>
    </div>
{/if}
</body>

<style>
    body {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    .loading-gif {
        position: fixed;
        top: 15%;
        left: 50%;
        width: 700px;
        height: 700px;
        z-index: 1000;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        transform: translateX(-50%);  /* This ensures that the GIF stays centered horizontally */
    }


    .content {
        display: flex;
        gap: 20px;
        height: 100vh;
        max-height: 100vh;
        width: 100vw;
        background-image: url("template/client/src/assets/gif.gif");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        align-items: flex-start;
        overflow: hidden;
    }


    .artworks-list {
        flex: 3;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: space-around;
        overflow-y: auto; /* Allow vertical scrolling */
        max-height: calc(100vh - 50px); /* Deducting some height to allow myself to add  a header if i decide to add one later on if i have time.*/
    }
</style>
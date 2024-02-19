<script>
    import tokenStore from "../tokenStore.js";
    import PopUpPostingArtworkGuidelines from "./PopUpPostingArtworkGuidelines.svelte";

    export let showGuidelines;

    let artworkName = "";
    let artworkType = "";
    let artistName = "";
    let artworkDescription = "";
    let authenticity = false;
    let startingPrice = 1;
    let artworkImage = "";
    let artworkColor = "";
    const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;  // 2 hours in milliseconds
    const FORTY_EIGHT_HOURS_IN_MS = 48 * 60 * 60 * 1000;  // 48 hours in milliseconds


    const ARTWORK_TYPES = ["painting", "sculpture", "portrait", "digital art", "child drawing", "landscape"];
    const COLORS = ["multicolor", "blue", "yellow", "purple", "black", "white", "red", "green", "grey", "metallic", "gold", "brown"];

    function handlePopUpClose() {
        showGuidelines = false;
        localStorage.setItem('guidelinesSeen', 'true');
    }

    const addArtwork = async () => {
        // Generate a random auction duration between 2 hours and 48 hours
        const randomAuctionDuration = TWO_HOURS_IN_MS + Math.random() * (FORTY_EIGHT_HOURS_IN_MS - TWO_HOURS_IN_MS);

        const startTime = Date.now();
        const endTime = startTime + randomAuctionDuration;

        try {
            await fetch('http://localhost:3000/artworks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${$tokenStore}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: artworkName,
                    type: artworkType,
                    artistName: artistName,
                    description: artworkDescription,
                    authenticity: authenticity ? "yes" : "no",
                    startTime: startTime,
                    endTime: endTime,
                    startingPrice: startingPrice,
                    image: artworkImage,
                    color: artworkColor
                })
            });


            alert('Artwork added successfully!');

            window.location.href = '/';

            // Reset fields after submitting
            artworkName = "";
            artworkType = "";
            artistName = "";
            artworkDescription = "";
            authenticity = "";
            startingPrice = 1;
            artworkImage = "";
            artworkColor = "";
        } catch (error) {
            console.error("Failed to add artwork:", error);
        }
    };
</script>

<!-- My PopUpPostingArtworkGuidelines is conditionally rendered based on the showGuidelines prop -->
<div>
{#if showGuidelines}
    <PopUpPostingArtworkGuidelines on:close={handlePopUpClose} />
{/if}
<h2>Add Artwork</h2>
<input type="text" bind:value={artworkName} placeholder="Artwork Name">
<select bind:value={artworkType}>
    {#each ARTWORK_TYPES as type}
        <option value={type}>{type}</option>
    {/each}
</select>
<input type="text" bind:value={artistName} placeholder="Artist Name">
<textarea bind:value={artworkDescription} placeholder="Artwork Description"></textarea>
<label>
    Authenticity:
    <input type="checkbox" bind:checked={authenticity}> Yes
</label>
<input type="number" bind:value={startingPrice} placeholder="Starting Price">
<input type="text" bind:value={artworkImage} placeholder="Image URL">
<select bind:value={artworkColor}>
    {#each COLORS as color}
        <option value={color}>{color}</option>
    {/each}
</select>
<button on:click={addArtwork}>Add Artwork</button>
</div>


<style>

    div {
        font-family: 'Roboto', 'Arial', sans-serif;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 600px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    div:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
    }

    h2 {
        font-size: 28px;
        color: #333;
        padding-bottom: 10px;
        margin-bottom: 30px;
        position: relative;
        display: inline-block;
    }

    h2::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3px;
        width: 100%;
        background-color: #0066ce;
        border-radius: 2px;
    }

    input[type="text"],
    input[type="number"],
    select,
    textarea {
        width: calc(100% - 22px);
        padding: 10px;
        margin-bottom: 20px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
        transition: border-color 0.3s;
    }

    input[type="text"]:focus,
    input[type="number"]:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border-color: #0066ce;
    }

    button {
        padding: 15px 30px;
        background-color: #0066ce;
        background-image: linear-gradient(45deg, #0056b3 50%, #007bff 50%);
        background-size: 200% 100%;
        background-position: 100% 0;
        color: white;
        font-size: 16px;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: background-position 0.5s, box-shadow 0.3s;
        display: block;
        width: 100%;
        box-shadow: 0 4px 14px rgba(0, 106, 206, 0.4);
    }

    button:hover {
        background-position: 0 0;
        box-shadow: 0 6px 20px rgba(0, 106, 206, 0.5);
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-size: 18px;
        color: #333;
    }

    .guidelines .content {
        background: white;
        padding: 20px;
        width: 80%;
        max-width: 500px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: hidden;
    }

    .guidelines .content::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 100%;
        background: linear-gradient(to right, transparent 50%, #007BFF 50%);
        z-index: 0;
        transition: all 0.7s ease-in-out;
    }

    .guidelines .content:hover::before {
        left: 100%;
    }


    @media (max-width: 768px) {
        div {
            width: 100%;
            margin: 10px;
            padding: 20px;
        }

        h2 {
            font-size: 24px;
        }

        button {
            padding: 10px 20px;
        }
    }
</style>

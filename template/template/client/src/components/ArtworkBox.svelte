
<script>
    export let artwork;

    export let showDetails;
</script>

<article>
    <h2>{artwork.title}</h2>
    <p>Artist: {artwork.artist}</p>
    <p>Type: {artwork.type}</p>
    <p>Color: {artwork.color}</p>
    <div class="shine-container" on:click={() => showDetails(artwork.id)}>
        <img src={artwork.url} alt={artwork.title} />
    </div>
    <button on:click={() => showDetails(artwork.id)}>View Details</button>
</article>

<style>
    img {
        max-width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 10px;
    }
    article h2,
    article p {
        color: white;
        text-shadow: 0 0 5px #ffffff,  0 0 10px #ffffff,
            2px 2px 2px rgba(0, 0, 0, 0.3);
    }

    article {
        width: 25%;
        position: relative;
        border: 1px solid #ccc;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background: rgba(
                213,
                213,
                110,
                0.2
        );
        transition: background 0.3s;
    }

    .shine-container {
        position: relative;
        overflow: hidden; /* with this i prevents the shine from going outside the image area */
    }

    .shine-container:hover::before {
        content: "";
        position: absolute;
        top: 0;
        left: -50%;
        width: 150%;
        height: 100%;
        background: linear-gradient(
                to right,
                transparent,
                rgba(255, 255, 255, 0.5),
                transparent
        );
        animation: shine 1.5s ease-out;
    }

    @keyframes shine {
        to {
            left: 100%;
        }
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
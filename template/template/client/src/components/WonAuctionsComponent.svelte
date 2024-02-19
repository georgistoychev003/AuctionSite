<script>
    export let wonAuctions = [];
    export let totalInvoiceAmount = 0;
</script>

<main class="space-theme">
    <h1>My Won Auctions</h1>
    {#if wonAuctions.length > 0}
        <p class="invoice">Your outstanding invoice for the auctions won is: {totalInvoiceAmount} €</p>
        <ul class="auctions-list">
            {#each wonAuctions as auction (auction.id)}
                <li class="auction-item">
                    <h2>{auction.name}</h2>
                    <p>Artist name: {auction.artistName}</p>
                    <p>Winning bid: {auction.highestBid} €</p>
                    <img src={auction.image} alt={auction.name} class="auction-image"/>
                </li>
            {/each}
        </ul>
    {:else}
        <p>You haven't won any auctions yet. Place your bids now! </p>
    {/if}
</main>


<style>
    /* Importing Orbitron Font */
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

    .space-theme {
        font-family: 'Orbitron', Arial, sans-serif;
        background: radial-gradient(circle, #030715, #000000);
        color: #E0E0E0;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
    }

    h1 {
        font-size: 2.5rem;
        color: #FFC700;
        text-shadow: 0px 0px 15px rgba(255, 199, 0, 0.8);
        text-align: center;
        margin-bottom: 30px;
    }
    .invoice {
        font-size: 2.5rem;
        color: rgb(238, 235, 236);
        text-shadow: 0px 0px 15px rgba(143, 255, 0, 0.9);
        text-align: center;
        margin-bottom: 30px;
    }

    .auctions-list {
        padding: 0;
        list-style: none;
        margin: 50px auto;
        max-width: 900px;
    }

    .auction-item {
        background-color: rgba(0, 0, 0, 0.6);
        border: 3px solid #414A5C;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5);
    }

    .auction-item h2 {
        font-size: 2rem;
        color: #FFC700;
        text-shadow: 0px 0px 15px rgba(255, 199, 0, 0.8);
        margin-bottom: 15px;
    }

    .auction-item p {
        font-size: 1.2rem;
        line-height: 1.5;
        margin-bottom: 15px;
    }

    .auction-image {
        max-width: 100%;
        height: auto;
        border: 3px solid #414A5C;
        border-radius: 5px;
        display: block;
        margin: 20px auto 0 auto;
    }
</style>
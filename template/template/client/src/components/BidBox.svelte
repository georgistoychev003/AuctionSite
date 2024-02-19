<script>
    export let bids;
    export let isAdmin;
    export let onBidDelete;
</script>

<div class="bids-list">
    <h2>All Bids</h2>
    {#each bids as bid (bid.id)}
        <div class="bid-item">
            <span>{bid.amount} € by {bid.userEmail} on {new Date(bid.bidTime).toLocaleString()}</span>
            {#if isAdmin}
                <button class="delete-bid-button" on:click={() => onBidDelete(bid.id)}>Delete Bid</button>
            {/if}
        </div>
    {/each}
    {#if bids.length === 0}
        <p>No bids yet.</p>
    {/if}
</div>

<style>
    .bids-list {
        margin-top: 30px;
        border-top: 2px solid #414A5C;
        padding-top: 20px;
    }

    .bids-list h2 {
        font-size: 1.8rem;
        color: #FFC700;
        text-shadow: 0px 0px 15px rgba(255, 199, 0, 0.8);
        margin-bottom: 15px;
    }

    .bid-item {
        padding: 5px 0;
        border-bottom: 1px dashed #414A5C;
        font-size: 1.1rem;
    }

    .bid-item:last-child {
        border-bottom: none;
    }

    .delete-bid-button {
        background-color: #E74C3C;
        box-shadow: 0px 0px 15px rgba(231, 76, 60, 0.6);
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        font-size: 0.9rem;
        font-family: 'Orbitron', Arial, sans-serif;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-left: 10px;
    }

    .delete-bid-button:hover {
        background-color: #a42315;
        box-shadow: 0px 0px 20px rgba(231, 76, 60, 0.8);
    }

    .delete-bid-button:focus {
        outline: none;
        box-shadow: 0px 0px 25px rgba(231, 76, 60, 1);
    }
</style>

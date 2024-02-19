<script>
    import {onDestroy, onMount} from "svelte";
    import tokenStore from '../tokenStore.js';
    import EditArtwork from "../components/EditArtwork.svelte";
    import BidBox from "../components/BidBox.svelte";
    export let params;
    let artwork = null;
    let timer;
    let token = null;
    let isAdmin = false;
    let isEditing = false;
    let startTimeRemaining = "Loading...";
    let endTimeRemaining = "Loading...";
    let bids = [];
    let highestBid = null;

    function decodePayload(jwtToken) {
        try {
            const base64Payload = jwtToken.split('.')[1];

//source i used for decoding the payload: https://stackoverflow.com/questions/47712370/javascript-code-and-decode-from-base64-using-atob-and-btoa-functions
            const payloadString = atob(base64Payload);

            //then i parse the json string into a normal js string object
            return JSON.parse(payloadString);
        } catch (e) {
            console.error("Failed to decode JWT:", e);
            return null;
        }
    }

    const unsubscribe = tokenStore.subscribe(value => {
       // when the token store updates i will assign the new value to the token
        token = value;

        //if token exists
        if (token) {

            // i deecode the payload of the jwt to extract its content so i can then check if the user is adnim.
            const decodedPayload = decodePayload(token);

            // i check if the decoded payload has a isAdmin property that equals true and if it does i
            // assign the result to the local isAdmin variable.
            isAdmin = decodedPayload && decodedPayload.isAdmin;
        } else {
            //returned when the user is not admin or if there is no token
            isAdmin = false;
        }
    });

    //this function is for normal users that are logged in
    const handlePlaceBid = async () => {
        //if no token present go to regiser page
        if (!token) {
            alert("You need to be logged in to place a bid")
            window.location.href = '/register';  // Redirect to the register page if not logged in
        } else {
            const amount = prompt("Enter your bid amount🔨:");
            //here initially i check if an amount was entered.Then if the entered amount is higher than the current highest bid or, if no bids have been made, i check if the amount is higher than the starting price of the artwork/auction.
            if(amount && Number(amount) > (highestBid ? highestBid.amount : artwork.startingPrice)) {
                try {

                        const response = await fetch(`http://localhost:3000/artworks/${artwork.id}/bids`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            artworkId: artwork.id,
                            amount,
                            userEmail: decodePayload(token).email
                        })
                    });

                    // Add bid to artwork.bids and update highestBid
                    const newBid = await response.json();
                    artwork.bids.push(newBid);
                    highestBid = artwork.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, { amount: 0 });

                } catch(error) {
                    console.error("Error placing bid:", error);
                }
            } else {
                alert("Your bid should be higher than the current highest bid or starting price. After succefully placing a bid refresh the page to see your bid in the list of bids");
            }
        }
    };

//this function is for admins only
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/artworks/${artwork.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if(response.status === 204) {
                window.location.href = '/';
            } else {
                const data = await response.json();
                console.error("Error deleting artwork:", data.error || data);
            }
        } catch (error) {
            console.error("Error deleting artwork:", error);
        }
    };

    // This function is for admins only
    const handleDeleteBid = async (bidId) => {
        if (!isAdmin) {
            alert("You need to be an admin to delete a bid.");
            return;
        }

        // Check if the auction has already finished
        if (new Date(artwork.endTime) < new Date()) {
            alert("You cannot delete a bid after the auction has ended.");
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete this bid?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:3000/artworks/${artwork.id}/bids/${bidId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 204) {
                    // Remove bid from local state
                    artwork.bids = artwork.bids.filter(bid => bid.id !== bidId);
                    if (artwork.bids.length > 0) {
                        highestBid = artwork.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, artwork.bids[0]);
                    } else {
                        highestBid = null;
                    }
                    alert("Bid deleted successfully.");
                } else {
                    const data = await response.json();
                    alert("Error deleting bid: " + (data.error || data.message));
                }
            } catch (error) {
                console.error("Error deleting bid:", error);
                alert("An error occurred while deleting the bid.");
            }
        }
    };

    //this function is for admins only
    const handleEdit = () => {
        isEditing = true;
    };

    /*
    formatCountdown function calculates the time difference between the current time and a given target time
    and then formats that difference into a string format of hours:minutes:seconds.
    I used help from chatGpt to understand how this should be done and overall to do the count down
     */
    function formatCountdown(targetTime) {
        const now = Date.now();
        const difference = targetTime - now;

        /*
        this is for the case where the auction has already started, in such cases, the function returns "00:00:00
         */
        if (difference <= 0) {
            return "00:00:00:00";
        }

        const days = Math.floor(difference / (24 * 60 * 60 * 1000)).toString().padStart(2, '0');
        /*
        Here, (60 * 60 * 1000) calculates the total number of milliseconds in an hour.The division gives the
        total hours remaining. Math.floor() rounds down to the nearest whole number.
        toString().padStart(2, '0') ensures the hours value is always displayed as two digits
        and adding a zero in front if necessary.
         */
        const hours = Math.floor(difference / (60 * 60 * 1000)).toString().padStart(2, '0');

        const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000)).toString().padStart(2, '0');

        const seconds = Math.floor((difference % (60 * 1000)) / 1000).toString().padStart(2, '0');

        return `${days}:${hours}:${minutes}:${seconds}`;
    }


    async function fetchArtworkDetails() {
        try {
            const response = await fetch(`http://localhost:3000/artworks/${params.id}`);
            if (response.ok) {
                artwork = await response.json();
                // Check if artwork.bids is an array before calling reduce
                if (Array.isArray(artwork.bids) && artwork.bids.length > 0) {
                    highestBid = artwork.bids.reduce(
                        (max, bid) => (bid.amount > max.amount ? bid : max),
                        { amount: 0 }
                    );
                } else {
                    highestBid = { amount: artwork.startingPrice, userEmail: 'Starting price' };
                    artwork.bids = [];
                }

                // Only start the countdown if start and end times are defined
                if (artwork.startTime && artwork.endTime) {
                    timer = setInterval(() => {
                        startTimeRemaining = formatCountdown(artwork.startTime);
                        endTimeRemaining = formatCountdown(artwork.endTime);
                    }, 1000);
                }
            } else {
                console.error('Error fetching artwork:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching artwork details:', error);
        }
    }

    onMount(async () => {
        await fetchArtworkDetails();
    });


    onDestroy(() => {
        clearInterval(timer);
        unsubscribe();
    });


</script>

<main class="space-theme">
    {#if artwork}
        <div class="artwork-wrapper">
            <div class="image-container">
                <img src={artwork.image} alt={artwork.name}/>
            </div>
            <div class="details-container">
                <h1>{artwork.name}</h1>
                <p>Artist: {artwork.artistName}</p>
                <p>Start Time: {startTimeRemaining === "00:00:00:00" ? "Auction has already started! Bid now or get left behind!" : startTimeRemaining}</p>
                <p>End Time: {endTimeRemaining === "00:00:00:00" ? "Auction has finished" : endTimeRemaining}</p>
                <p>Color: {artwork.color}</p>
                <p>Type: {artwork.type}</p>
                <p>Authenticity: {artwork.authenticity}</p>
                <p>Starting price: {artwork.startingPrice} €</p>
                <p>Description: {artwork.description}</p>

                <p>
                    {#if highestBid}
                        Current highest bid: {highestBid.amount} € by {highestBid.userEmail}
                    {:else}
                        Starting price: {artwork.startingPrice} €
                    {/if}
                </p>


                {#if !isAdmin}
                    <!-- Check if the auction is still ongoing by comparing endTime with the current time , if auction has fi ished i will not allow any bids to be placed by the user-->
                    {#if endTimeRemaining !== "00:00:00:00"}
                        <button class="bid-button" on:click={handlePlaceBid}>Place Bid</button>
                    {:else}
                        <p class="auction-ended">Auction has finished.</p>
                    {/if}
                {/if}
                {#if isAdmin && !isEditing}
                    <button class="admin-button delete-button" on:click={handleDelete}>Delete</button>
                    <button class="admin-button edit-button" on:click={handleEdit}>Edit</button>
                {/if}

                {#if isEditing}
                    <EditArtwork artwork={artwork} token={token} />
                {/if}

                <!-- Check if bids exist and render the BidBox component -->
                {#if artwork.bids && artwork.bids.length > 0}
                    <BidBox
                            bids={artwork.bids}
                            isAdmin={isAdmin}
                            onBidDelete={handleDeleteBid}
                    />
                {:else}
                    <p>No bids yet.</p>
                {/if}

            </div>
        </div>
    {:else}
        Loading...
    {/if}
</main>

<style>
    /* Importing Orbitron Font from Google Fonts ask Gerralt if i should do it like that*/
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');


    .space-theme {
        font-family: 'Orbitron', Arial, sans-serif;
        background: radial-gradient(circle, #030715, #000000);
        color: #E0E0E0;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
    }

    .artwork-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.6);
        border: 3px solid #414A5C;
        border-radius: 10px;
        margin: 50px auto;
        max-width: 900px;
        box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5);
    }

    .image-container img {
        max-width: 300px;
        height: auto;
        margin-right: 20px;
        border: 3px solid #414A5C;
        border-radius: 5px;
    }

    .details-container {
        flex: 1;
    }

    h1 {
        font-size: 2.5rem;
        color: #FFC700;
        text-shadow: 0px 0px 15px rgba(255, 199, 0, 0.8);
        margin-bottom: 20px;
    }

    p {
        margin-bottom: 15px;
        font-size: 1.2rem;
        line-height: 1.5;
    }

    .bid-button {
        background-color: #FFC700;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 1.2rem;
        font-family: 'Orbitron', Arial, sans-serif;
        color: #030715;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0px 0px 15px rgba(255, 199, 0, 0.6);
        margin-top: 20px;
    }

    .bid-button:hover {
        background-color: #e0b400;
        box-shadow: 0px 0px 20px rgba(255, 199, 0, 0.8);
    }

    .bid-button:focus {
        outline: none;
        box-shadow: 0px 0px 20px rgba(255, 199, 0, 1);
    }


    .bids-list h2 {
        font-size: 1.8rem;
        color: #FFC700;
        text-shadow: 0px 0px 15px rgba(255, 199, 0, 0.8);
        margin-bottom: 15px;
    }


    /* Common styling for both buttons */
    .admin-button {
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 1.2rem;
        font-family: 'Orbitron', Arial, sans-serif;
        color: #E0E0E0;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
        margin-right: 5px;
        text-shadow: 0px 0px 8px rgba(224, 224, 224, 0.8);
    }

    /* Edit Button Styling */
    .edit-button {
        background-color: #28B463;
        box-shadow: 0px 0px 15px rgba(40, 180, 99, 0.6);
    }

    .edit-button:hover {
        background-color: #0f7337;
        box-shadow: 0px 0px 20px rgba(40, 180, 99, 0.8);
    }

    .edit-button:focus {
        outline: none;
        box-shadow: 0px 0px 25px rgba(40, 180, 99, 1);
    }

    /* Delete Button Styling */
    .delete-button {
        background-color: #E74C3C;
        box-shadow: 0px 0px 15px rgba(231, 76, 60, 0.6);
    }

    .delete-button:hover {
        background-color: #a42315;
        box-shadow: 0px 0px 20px rgba(231, 76, 60, 0.8);
    }

    .delete-button:focus {
        outline: none;
        box-shadow: 0px 0px 25px rgba(231, 76, 60, 1);
    }


    .auction-ended {
        color: red;
        font-weight: bold;
        animation: glow 1s ease-in-out infinite alternate;
    }

    @keyframes glow {
        from {
            text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff3300, 0 0 70px #ff3300, 0 0 80px #ff3300, 0 0 100px #ff3300, 0 0 150px #ff3300;
        }
        to {
            text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000, 0 0 20px #ff3300, 0 0 35px #ff3300, 0 0 40px #ff3300, 0 0 50px #ff3300, 0 0 75px #ff3300;
        }
    }

</style>

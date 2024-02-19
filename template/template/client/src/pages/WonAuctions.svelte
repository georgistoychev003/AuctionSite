<script>
    import {onDestroy, onMount} from "svelte";
    import tokenStore from '../tokenStore.js';
import WonAuctionsComponent from "../components/WonAuctionsComponent.svelte";
    let wonAuctions = [];
    let token = null;
    let totalInvoiceAmount = 0;

    function decodePayload(jwtToken) {
        try {
            const base64Payload = jwtToken.split('.')[1];
            const payloadString = atob(base64Payload);
            return JSON.parse(payloadString);
        } catch (e) {
            console.error("Failed to decode JWT:", e);
            return null;
        }
    }

    const unsubscribe = tokenStore.subscribe(value => {
        token = value;
    });

    onMount(async () => {
        if (token) {
            const userEmail = decodePayload(token).email;

            try {
                const response = await fetch(`http://localhost:3000/artworks/won/${userEmail}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                wonAuctions = await response.json();

                // Calculate the total invoice amount for all won auctions
                totalInvoiceAmount = wonAuctions.reduce((total, auction) => total + auction.highestBid, 0);
                console.log(wonAuctions);
            } catch (error) {
                console.error("Error fetching won auctions:", error);
            }
        }
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<WonAuctionsComponent {wonAuctions} {totalInvoiceAmount} />
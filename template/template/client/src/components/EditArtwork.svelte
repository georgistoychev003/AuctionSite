<script>
    export let artwork; // Passed from the parent
    export let token; // Passed from the parent
    let updatedArtwork = {...artwork};

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:3000/artworks/${artwork.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedArtwork)
            });

            if (response.status === 200) {
                // Redirect back to the artwork page after successful update
                window.location.href = `/artworkdetails/${artwork.id}`;
            } else {
                const data = await response.json();
                console.error("Error updating artwork:", data.error || data);
            }
        } catch (error) {
            console.error("Error updating artwork:", error);
        }
    };
</script>

<main class="edit-form">
    <h2>Edit Artwork</h2>
    <form on:submit|preventDefault={handleUpdate}>
        <!-- Fields for artwork editing -->
        <label for="name">Name:</label>
        <input bind:value={updatedArtwork.name} id="name" required/>

        <label for="artistName">Artist Name:</label>
        <input bind:value={updatedArtwork.artistName} id="artistName" required/>

        <label for="description">Description:</label>
        <textarea bind:value={updatedArtwork.description} id="description" required></textarea>

        <label for="type">Type:</label>
        <select bind:value={updatedArtwork.type} id="type">
            <option value="painting">Painting</option>
            <option value="sculpture">Sculpture</option>
            <option value="portrait">Portrait</option>
            <option value="digitalart">Digital art</option>
            <option value="landscape">Landscape</option>
            <option value="childdrawing">Child drawing</option>
        </select>

        <label for="authenticity">Authenticity:</label>
        <select bind:value={updatedArtwork.authenticity} id="authenticity">
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select>

        <!-- I do not want to allow editing the start and end time of an auctio that has already started and it does not make sense, as if it should be deleted otherwise instead/>-->
        <!--        <label for="startTime">Start Time:</label>-->
        <!--        <input type="datetime-local" bind:value={updatedArtwork.startTime} id="startTime" required disabled/>-->

        <!--        <label for="endTime">End Time:</label>-->
        <!--        <input type="datetime-local" bind:value={updatedArtwork.endTime} id="endTime" required disabled/>-->

        <label for="startingPrice">Starting Price:</label>
        <input type="number" bind:value={updatedArtwork.startingPrice} id="startingPrice" required/>

        <label for="image">Image URL:</label>
        <input bind:value={updatedArtwork.image} id="image" required/>

        <label for="color">Color:</label>
        <select bind:value={updatedArtwork.color} id="color" required>
            <option value="">Any</option>
            <option value="multicolor">Multicolor</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="purple">Purple</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="grey">Grey</option>
            <option value="metallic">Metallic</option>
            <option value="gold">Gold</option>
            <option value="brown">Brown</option>
        </select>


        <button type="submit">Update</button>
    </form>
</main>


<style>
    .edit-form {
        background-color: rgba(0, 0, 0, 0.7);
        padding: 20px;
        margin-top: 20px;
        border: 2px solid #414A5C;
        border-radius: 5px;
    }

    .edit-form h2 {
        font-size: 2rem;
        margin-bottom: 15px;
        color: #FFC700;
    }

    .edit-form label {
        display: block;
        margin-bottom: 10px;
    }

    .edit-form input, .edit-form select {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 2px solid #ffc700;
        border-radius: 5px;
        background: none;
        color: #b4b4b4;
    }


    .edit-form button {
        padding: 10px 20px;
        margin-right: 10px;
        cursor: pointer;
        background-color: #ffc700;
        border: none;
        border-radius: 5px;
        color: #030715;
    }

</style>

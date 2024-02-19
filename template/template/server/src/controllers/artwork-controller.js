import statusCodes from "http-status-codes";
import {StatusCodes} from "http-status-codes";
import artworks from './artworks.js';
import { body, validationResult } from 'express-validator';

//get all artworks
export function getAllArtworks(req, res) {
    let filteredArtworks = artworks;

    // Filtering based on color
    if (req.query.color) {
        filteredArtworks = filteredArtworks.filter(art => art.color === req.query.color);
    }

    // Filtering based on type
    if (req.query.type) {
        filteredArtworks = filteredArtworks.filter(art => art.type === req.query.type);
    }

    // Filtering based on price
    if (req.query.price) {
        const priceRange = req.query.price.split('-').map(Number);
        if (priceRange.length === 1) { // Only has a single value (for example 25000000+)
            filteredArtworks = filteredArtworks.filter(art => art.startingPrice > priceRange[0]);
        } else { // Price range (for exampl 0-1000)
            filteredArtworks = filteredArtworks.filter(art => art.startingPrice >= priceRange[0] && art.startingPrice <= priceRange[1]);
        }
    }

    res.status(StatusCodes.OK).json(filteredArtworks);
}


//find artwork by name
export function findArtwork(req, res) {
    const id = parseInt(req.params.id, 10);  // Convert the id to a number
    const artwork = artworks.find(art => art.id === id);

    if (artwork) {
        res.json(artwork);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({message: 'The artwork was not found'});

    }
}





let lastId = artworks.length > 0 ? artworks[artworks.length - 1].id : 0; // Get the last id so i can increment it when i post a new artwork and assign the new id

// Artwork validation middleware
export const validateArtwork = [
    body('name').isString().isLength({ min: 1 }),
    body('type').isIn(["painting", "sculpture", "portrait", "digital art", "child drawing", "landscape"]),
    body('artistName').isString().isLength({ min: 1 }),
    body('description').isString().isLength({ min: 4 }),
    body('authenticity').isIn(["yes", "no"]),
    body('startingPrice').isNumeric({ no_symbols: true }).isFloat({ min: 1 }),
    body('color').isIn(["multicolor", "blue", "yellow", "purple", "black", "white", "red", "green", "grey", "metallic", "gold", "brown"])
];


//add/post artwork
export function addArtwork(req, res) {
    console.log("Request body:", req.body);
    const errors = validationResult(req);
    console.log("Validation errors:", errors.array());
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    lastId++; // Increment id
    //  a new artwork object with bids initialized to an empty array
    const artwork = {
        ...req.body,
        id: lastId, // Assign new id
        bids: [] // Initialize bids as an empty array
    };

    artworks.push(artwork);
    res.status(StatusCodes.CREATED).json(artwork);
}

//delete one artwork by its id
export function deleteArtwork(req, res) {
    const id = parseInt(req.params.id, 10);
    const index = artworks.findIndex(art => art.id === id);

    if (index === -1) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "artwork with id " + id + " not found" });
    }

    artworks.splice(index, 1);
    return res.status(StatusCodes.NO_CONTENT).json();
}



//edit artwork
export function editArtwork(req, res) {
    const id = parseInt(req.params.id, 10);
    const index = artworks.findIndex(art => art.id === id);

    if (index === -1) {
        return res.status(StatusCodes.NOT_FOUND).send('Artwork not found');
    }

    const { image, name, type, artistName, description, authenticity, startTime, endTime, startingPrice, color } = req.body;

    // Validate that startingPrice is not a negative number
    if (startingPrice <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Price must be a positive number.' });
    }

    artworks[index] = { ...artworks[index], image, name, type, artistName, description, authenticity, startTime, endTime, startingPrice, color };

    res.status(StatusCodes.OK).json(artworks[index]);
}




export const addBidToArtwork = (req, res) => {
    const { id } = req.params; // This is the artwork ID
    const { userEmail, amount } = req.body;


    const artwork = artworks.find(a => a.id === Number(id));
    if (!artwork) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Artwork not found' });
    }


    const newBid = {

        //i used to have this as id: artwork.bids.length + 1, but i had issues as when i did not
        // refresh the page after i have posted a bid and tried to directly post another bid
        // i got issues as two bids were placed simultaneously on the same id. So i decided to make it more random:
        id: Date.now() + Math.floor(Math.random() * 1000),

        userEmail,
        amount: Number(amount),
        bidTime: new Date()
    };


    const lastBid = artwork.bids[artwork.bids.length - 1];
    if (lastBid && amount <= lastBid.amount) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Bid must be higher than the last bid.' });
    }

    if (new Date(artwork.endTime) <= new Date()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Auction has ended.' });
    }

    artwork.bids.push(newBid);
    res.status(StatusCodes.CREATED).json(newBid);
};


export const getBidsForArtwork = (req, res) => {
    const { id } = req.params; // Artwork id
    const artwork = artworks.find(a => a.id === parseInt(id));
    if (!artwork) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Artwork not found' });
    }

    res.json(artwork.bids);
};



export function deleteBidFromArtwork(req, res) {
    const artworkId = parseInt(req.params.id, 10);
    const bidId = parseInt(req.params.bidId, 10);
    const artworkIndex = artworks.findIndex(art => art.id === artworkId);

    if (artworkIndex === -1) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Artwork with id " + artworkId + " not found" });
    }

    const bidIndex = artworks[artworkIndex].bids.findIndex(bid => bid.id === bidId);

    if (bidIndex === -1) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Bid with id " + bidId + " not found" });
    }

    // Remove the bid from the bids array of the artwork
    artworks[artworkIndex].bids.splice(bidIndex, 1);

    // Respond with no content but the de;etion was successful
    return res.status(StatusCodes.NO_CONTENT).json();
}


export const wonAuctionsByUser = (req, res) => {
    const userEmail = req.params.email; // Get user email from the request parameters
    const currentTime = Date.now(); // Current time to compare with auction end times

    // Filter out artworks whose auctions have ended
    const endedArtworks = artworks.filter(artwork => new Date(artwork.endTime).getTime() <= currentTime);

    // Map through ended artworks to find the highest bid by the user
    const wonAuctions = endedArtworks.map(artwork => {
        // Get bids for the current artwork and sort them to find the highest bid
        const highestBid = artwork.bids

            //the sort code i took from this source: https://forum.freecodecamp.org/t/arr-sort-a-b-a-b-explanation/167677
            .sort((a, b) => b.amount - a.amount)[0]; //  bids are sorted in ascending order

        // Check if the highest bid belongs to the user
        if (highestBid && highestBid.userEmail === userEmail) {
            return {
                ...artwork,
                highestBid: highestBid.amount // Add the highest bid amount to the artwork object
            };
        }
        return null; // Return null if the user doesn't have the highest bid
    }).filter(artwork => artwork !== null); // here i filter out nulls to keep only won auctions

    res.status(StatusCodes.OK).json(wonAuctions); // Return the won auctions
};


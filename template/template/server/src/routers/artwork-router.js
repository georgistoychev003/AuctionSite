import express from 'express';
const router = express.Router();

import * as artworkController from '../controllers/artwork-controller.js';
import {isLoggedIn} from "../middleware/isLoggedin.js";
import {isAdmin} from "../middleware/isAdmin.js";
import {  validateArtwork } from '../controllers/artwork-controller.js';


router.post('/', isLoggedIn, isAdmin, validateArtwork, artworkController.addArtwork);
router.get('/', artworkController.getAllArtworks);
router.get('/:id', artworkController.findArtwork);
router.delete('/:id' , isLoggedIn, isAdmin, artworkController.deleteArtwork);
router.put('/:id', isLoggedIn, isAdmin, artworkController.editArtwork);

router.post('/:id/bids', isLoggedIn, artworkController.addBidToArtwork); // Add a bid to an artwork
router.get('/:id/bids', isLoggedIn, artworkController.getBidsForArtwork); // Get all bids for an artwork
router.delete('/:id/bids/:bidId', isLoggedIn, isAdmin, artworkController.deleteBidFromArtwork); //Delete a bid for an artwork
router.get('/won/:email', isLoggedIn, artworkController.wonAuctionsByUser); //  get won auctions by a user

export default router;



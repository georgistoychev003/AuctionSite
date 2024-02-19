import express from 'express';
const router = express.Router();

import * as routerController from '../controllers/tokens-controller.js';
import {isLoggedIn} from "../middleware/isLoggedin.js";

router.post('/', routerController.createToken);
router.get('/', isLoggedIn, routerController.getUserData);


export default router;
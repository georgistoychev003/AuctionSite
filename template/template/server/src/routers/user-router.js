import express from 'express';


import { isLoggedIn } from '../middleware/isLoggedin.js';

import {isAdmin} from "../middleware/isAdmin.js";

const router = express.Router();

import * as userController from '../controllers/user-controller.js';


router.post('/',   userController.addUser);
router.get('/', isLoggedIn, isAdmin, userController.getAllUsers);
router.get('/:id', isLoggedIn, isAdmin, userController.getOneUserById);

export default router;

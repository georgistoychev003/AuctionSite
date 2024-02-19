import express from 'express';
import statusCodes, {StatusCodes} from "http-status-codes";
import bcrypt from 'bcrypt';
import { generateToken } from './tokens-controller.js';

import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const router = express.Router();

const SECRET = "dhdkshoidw273219102dsdqdpo";


async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

export {hashPassword};

const __filename = fileURLToPath(import.meta.url);   //convert the URL to a file path.
const __dirname = dirname(__filename);  //extract the directory name from the file path.

const usersFilePath = path.join(__dirname, 'users.json');  //joining  the path to my users.json located in the same directory as the current module so that i can operate with that json

function readUsersFromFile() {
    const usersJson = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(usersJson);
}

function writeUsersToFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}
export async function addUser(req, res) {
    try {
        console.log(req.body);
        const {email, password} = req.body;

        // Read users from file
        const users = readUsersFromFile();

        // Validate email and password
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: 'Email and password are required'});
        }

        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: 'Email already exists'});
        }


        // Hash the password
        console.log("About to hash password");
        const hashedPassword = await hashPassword(password);
        console.log("Finished hashing password");

        // Store user
        const user = {
            id: users.length + 1,
            ...req.body,
            password: hashedPassword,
            isAdmin: false
        };
        users.push(user);

        // Write updated users list to file
        writeUsersToFile(users);


        // Send back the user data with a 201 status code
        res.status(StatusCodes.CREATED).json({
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken({id: user.id, email: user.email, isAdmin: user.isAdmin})
        });

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});

    }
}




export function getAllUsers(req, res) {
    const users = readUsersFromFile();
    res.json(users);
}


export const getOneUserById = (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Read users from file
    const users = readUsersFromFile();

    const user = users.find(user => user.id === id);

    if (user) {
        res.json(user);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: `User with ID ${id} not found!` });
    }
}

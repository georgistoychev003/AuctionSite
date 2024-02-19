import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashPassword } from './user-controller.js';

const SECRET = "dhdkshoidw273219102dsdqdpo";

function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

async function verifyPassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
}

function getUserByEmail(email) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const usersJson = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
    const users = JSON.parse(usersJson);
    return users.find(user => user.email === email);
}

async function createToken(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required.'});
    }

    const user = getUserByEmail(email);
    if (!user) {
        return res.status(400).send('No user found with that email.');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Incorrect password.');
    }

    const token = generateToken({ userId: user.id, email: email, isAdmin: user.isAdmin });
    return res.status(201).json({ token: token });


}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
}

async function getUserData(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).send('Authorization header is missing or incorrect.');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
        return res.status(401).send('Invalid token.');
    }

    const user = getUserByEmail(decodedToken.email);
    if (!user) {
        return res.status(404).send('User not found.');
    }

    // Return user data without the password
    const { password, ...userData } = user;
    return res.status(200).json(userData);
}


export { generateToken, createToken, verifyToken, getUserData };

import { verifyToken } from '../controllers/tokens-controller.js';

export const isLoggedIn = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Authorization header missing or incorrect');
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
}

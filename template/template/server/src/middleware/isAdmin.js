
import { isLoggedIn } from "./isLoggedIn.js";

export const isAdmin = (req, res, next) => {
    isLoggedIn(req, res, () => {
        if(req.user && req.user.isAdmin){
            next();
        } else {
            res.status(403).send("Unauthorized: You are not an admin");
        }
    });
};

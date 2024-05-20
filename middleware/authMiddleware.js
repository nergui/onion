// authMiddleware.js
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assumes "Bearer TOKEN_VALUE"
        if (token === "VZ6333jTvi6JvDzv1eFogPPT3BlbkFwordQWYtJbk7K269asdQPO") {
            next(); // Token is correct, proceed to the route handler
        } else {
            res.status(403).json({ error: 'Unauthorized, token invalid' });
        }
    } else {
        res.status(401).json({ error: 'Authorization header missing' });
    }
}

module.exports = verifyToken;

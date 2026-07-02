import jwt from 'jsonwebtoken';
import { db } from '../config/db.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            // Unauthorized
            return res.status(401).json({
                success: false,
                message: "Authorization Missing",
            })
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Access token has expired"
                })
            }
            return res.status(401).json({
                success: false,
                message: "Access token is missing or invalid"
            })
        }

        const [user] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [decoded.id]
        )

        if (user.length === 0) {
            return res.status(404).json({
                // Not Found
                success: false,
                message: "User Not Found"
            })
        }
        req.user = {
            id: user[0].id,
            name: user[0].name,
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}
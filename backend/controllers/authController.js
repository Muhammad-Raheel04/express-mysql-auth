import validator from 'validator';
import { connect } from '../config/db.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            // bad request
            return res.status(400).json({
                success: false,
                message: "All field are required",
            })
        }
        const [rows] = await connect.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        if (rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exist",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await connect.query(
            "INSERT INTO users(name,email,password) VALUES (?,?,?)",
            [name, email, hashedPassword]
        )

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}
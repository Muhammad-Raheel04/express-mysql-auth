import validator from 'validator';
import { db } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../services/mailService.js';

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
        const [rows] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        if (rows.length > 0) {
            // Conflict
            return res.status(409).json({
                success: false,
                message: "User already exist",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO users(name,email,password) VALUES (?,?,?)",
            [name, email, hashedPassword]
        )

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '10m' });

        try {
            await sendVerificationEmail(name, email, token);
        } catch (err) {
            await db.query(
                "DELETE FROM users WHERE id = ?",
                [result.insertId]
            )
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email. Please try again.",
            })
        }

        await db.query(
            "UPDATE users SET token = ? WHERE id = ?",
            [token, result.insertId]
        )

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email to verify your account."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            // bad request
            // missing fields
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const [result] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        )

        if (result.length === 0) {
            // not found
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(password, result[0].password);

        if (!isMatch) {
            // unauthorized
            return res.status(401).json({
                success: false,
                message: "Password incorrect"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            id: result[0].id
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

import validator from 'validator';

export const validateRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
        // bad request
        // invalid email format
        return res.status(400).json({
            success: false,
            message: "Invalid Email Format"
        })
    }

    if (password.length < 8) {
        // Bad Request
        // Password Too Short
        return res.status(400).json({
            success: false,
            message: "Password Too Short",
        })
    }
    // pass the request to next handler
    next();
}
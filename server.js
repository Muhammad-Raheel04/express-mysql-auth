import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './config/db.js';
import authRoutes from './routes/authRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());


app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(PORT, () => {
    console.log(`Visit http://localhost:${PORT}`)
})
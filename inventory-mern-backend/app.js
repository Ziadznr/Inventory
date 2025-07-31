const express = require('express');
const app = express();
const router = require('./src/routes/api');
require('dotenv').config();

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const apiCorsOptions = {
    origin: '*',
    credentials: true,
};

app.use('/api/v1', cors(apiCorsOptions));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3000,
});
app.use(limiter);

// MongoDB connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
}
connectDB();

// Routing
app.use('/api/v1', router);

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ status: "fail", data: "Not Found" });
});

module.exports = app;

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


async function connectDB() {
    try {
        // Connect using Mongoose
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,          // automatically build indexes
            serverSelectionTimeoutMS: 5000, // optional: timeout after 5s
        });

        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);

        // Handle SRV DNS lookup issues
        if (error.message.includes('querySrv')) {
            console.error('💡 SRV DNS lookup failed. Try using the full non-SRV connection string from MongoDB Atlas:');
            console.error('   mongodb://<username>:<password>@host1:27017,host2:27017,host3:27017/<dbname>?retryWrites=true&w=majority');
        }

        console.warn('⚠️ App will continue running, but database is not connected.');
        // Optional: process.exit(1); // Uncomment if you want to stop the app
    }
}

// Run the connection
connectDB();


// Routing
app.use('/api/v1', router);

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ status: "fail", data: "Not Found" });
});

module.exports = app;

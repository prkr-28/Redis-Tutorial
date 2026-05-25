import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/redis', async (req, res) => {
    try {
        const reply = await redis.ping();
        res.send({ redis: reply });
    } catch (error) {
        res.status(500).send('Error connecting to Redis');
    }
});

app.get('/mongodb', async (req, res) => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mongo';

        if (!mongoose.connection.readyState) {
            await mongoose.connect(mongoUri);
        }
        res.send({ mongodb: 'Connected', database: mongoose.connection.name });
    } catch (error) {
        res.status(500).send('Error connecting to MongoDB');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
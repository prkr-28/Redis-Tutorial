import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post('/otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, 'EX', 30);// OTP expires in 30 seconds
    res.json({ message: 'OTP sent', otp });
});

app.post('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
    }
    const storedOtp = await redis.get(otpKey(phone));
    if (!storedOtp) {
        return res.status(400).json({ error: 'OTP has expired' });
    }
    if (storedOtp === otp) {
        await redis.del(otpKey(phone)); // Invalidate OTP after successful verification
        return res.json({ message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const { phone } = req.params;
    const ttl = await redis.ttl(otpKey(phone));
    res.json({ ttl: ttl });
});
app.get('/', (req, res) => {
    res.send('Server working');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
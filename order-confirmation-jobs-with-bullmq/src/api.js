import express from 'express';
import { emailQueue } from './queue.js';

const app = express();

app.use(express.json());

app.post('/welcome-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    // Add a job to the email queue with the provided email address
    await emailQueue.add('send-Welcome-Email', {
        to: email,
        name: 'John Doe' // You can replace this with dynamic data as needed
    }, {
        attempts: 3, // Retry up to 3 times if the job fails
        backoff: {
            type: 'exponential',
            delay: 5000, // Initial delay of 5 seconds before retrying
        },
    });
    return res.json({ message: 'Welcome email job has been added to the queue', jobId: job.id });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
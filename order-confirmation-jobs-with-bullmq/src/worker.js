import { worker } from 'bullmq';
import { connection } from './queue.js';

const emailWorker = new Worker(
    // name of the queue to process
    "emails",
    // the processing function for each job
    async (job) => {
        console.log(`Processing job ${job.id} with data:`, job.data);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(`Job ${job.id} completed.`);
    },
    // connection options for Redis
    { connection }
);

emailWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has been completed.`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
});
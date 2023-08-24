import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import { NotFoundError } from './errors/NotFoundError';
import { errorHandler } from './middlewares/errorHandler';
import { contractRouter } from './routes/contracts';

const app = express();
app.use(cors());
app.use(json());

// all routes  
app.use(contractRouter);

app.all('*', async () => {
    throw new NotFoundError('Route not found.');
});
app.use(errorHandler);

export { app };
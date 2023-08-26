import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import { NotFoundError } from './errors/NotFoundError';
import { errorHandler } from './middlewares/errorHandler';
import { contractRouter } from './routes/contracts';
import { jobRouter } from './routes/jobs';
import { balanceRouter } from './routes/balances';
import { adminRouter } from './routes/admin';

const app = express();
app.use(cors());
app.use(json());

// all routes  
app.use(contractRouter);
app.use(jobRouter);
app.use(balanceRouter);
app.use(adminRouter);

app.all('*', async () => {
    throw new NotFoundError('Route not found.');
});
app.use(errorHandler);

export { app };
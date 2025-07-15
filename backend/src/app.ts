import express from 'express';
import router from './routes/pageRoutes';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
connectDB();

app.use('/api/v1', router);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

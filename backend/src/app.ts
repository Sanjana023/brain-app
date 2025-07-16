import express from 'express';
import router from './routes/pageRoutes';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());  
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true  
}));
connectDB();

app.use('/api/v1', router);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

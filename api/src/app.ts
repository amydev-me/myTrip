import express from 'express';
import cors from 'cors';
import "dotenv/config";
import { json } from 'body-parser';
import { userRoutes } from './routes/users';
import { authRoutes } from './routes/auth';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


export { app };
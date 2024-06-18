import express, { Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_URL as string);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", async (req:Request, res: Response) => {
    res.json({
        message: "Hi! This is first endpoint!"
    });
});

app.listen(3002, () => {
    console.log("server is running on localhost:3002")
});
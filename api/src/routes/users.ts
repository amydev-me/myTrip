import express, { Request, Response } from 'express';
import { User } from "../models/user";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/test', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hello World!"
    })
});


router.post("/register", async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = User.build({
            email, password, firstName, lastName
        });

        await user.save();

        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);

        req.session = {
            jwt : userJwt
        };

        return res.status(200).send({ message: "User registered OK" });

    }catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong."
        });
    }
});

export { router as userRoutes };
import express, { Request, Response } from 'express';
import { User } from "../models/user";
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const router = express.Router();

router.post("/register", [
        check("firstName", "First Name is required").isString(),
        check("lastName", "Last Name is required").isString(),
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({ min: 6 })
    ], async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
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
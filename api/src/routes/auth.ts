import express, { Request, Response} from "express";
import { check, validationResult } from "express-validator";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();


router.post("/login", [ 
        check("email", "Email is required.").isEmail(),
        check("password", "Password with 6 or more characters required.").isLength({ min : 6 }) 
    ], async (req: Request, res: Response) => {

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
    
        const { email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });

            if(!existingUser) {
                return res.status(404).json({ message: "Invalid credentials."})
            }

            const passwordsMatch = await Password.compare(existingUser.password, password);
            if(!passwordsMatch){
                return res.status(404).json({ message: "Invalid credentials."})
            }

            const userJwt = jwt.sign({ 
                userId: existingUser.id,
                email: existingUser.email
            }, process.env.JWT_KEY!,{
                expiresIn: "1d"
            });
        
            res.cookie("token", userJwt, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });
        
            res.status(200).send(existingUser);

        }catch(error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong." })
        }
});

router.post('/logout', (req: Request, res:Response) => {
    res.cookie("token", "", { 
        expires: new Date(0)
    });

    res.status(200).send({ message: "Logout successful!" })
});

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId })
});

export { router as authRoutes };
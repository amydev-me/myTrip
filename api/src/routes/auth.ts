import express, { Request, Response} from "express";
import { check, validationResult } from "express-validator";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

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
                id: existingUser.id,
                email: existingUser.email
            }, process.env.JWT_KEY!);
        
            req.session = {
                jwt : userJwt
            };
        
            res.status(200).send(existingUser);

        }catch(error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong." })
        }
});

router.post('/logout', (req: Request, res:Response) => {
    req.session = null;

    res.send({})
})

export { router as authRoutes };
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const verifyToken = (req: Request, res:Response, next: NextFunction) => {
    const token = req.cookies["token"];

    if(!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY as string);
        req.userId = (decode as JwtPayload).userId;
        next();
    }catch(error) {
        return res.status(401).json({ message: "unauthorized" });
    }
}

export default verifyToken;
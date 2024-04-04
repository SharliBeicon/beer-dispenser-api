import {verify, decode, UserJwtPayload} from "jsonwebtoken";
import Config from "../config/Config";
import {Request, Response} from "express"

declare module "jsonwebtoken"{
    export interface UserJwtPayload extends JwtPayload {
        isAdmin: boolean
    }
}

export default class Authentication{
    public async authenticateToken(req: Request, res: Response, next: Function) {
        const token = req.header('Authorization');
    
        if (!token) {
            return res.status(401).json("Unauthorized. Missing token");
        }
    
        await verify(token, Config.secretKey, (err) => {
            if (err) {
                return res.status(403).json("Unauthorized. Invalid token");
            }
            next();
        });
    }

    public async authenticateAdmin(req: Request, res: Response, next: Function){
        const token = req.header('Authorization');

        if(token){
            const decoded = await decode(token, {complete: true});
            if(decoded){
                const decodedPayload : UserJwtPayload = decoded.payload as UserJwtPayload;
                if(!decodedPayload.isAdmin){
                    return res.status(401).json("Unauthorized. User is not admin");
                }
            }
        }

        next();
    }
}
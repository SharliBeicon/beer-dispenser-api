import { Request, Response } from "express";
import UserRepo from "../model/User";
import bcrypt from 'bcrypt';
import Config from "../config/Config";
import { sign } from "jsonwebtoken";
export default class User {
    private userRepo: UserRepo;

    constructor(){
        this.userRepo = new UserRepo();
    }

    public register = async (req: Request, res: Response) => {
        const {username, password, isAdmin} = req.body;
        if(username && password && isAdmin !== undefined){
            const hashedPassword = await bcrypt.hash(password, 10);
            const userExists = await this.userRepo.findByUsername(username);
            if(userExists){
                res.status(400).json("User already exists");
            } else {
                this.userRepo.create({
                    username: username,
                    password: hashedPassword,
                    isAdmin: isAdmin
                }).then(() =>{
                    res.status(201).json("User created succesfully");
                }).catch(() =>{
                    res.status(500).json("Something went wrong");
                });
            }
        }else {
            res.status(401).json("Body is not formated properly");
        }
    }

    public login =  async (req: Request, res: Response) => {
          const { username, password } = req.body;
        
          if(username && password){
            const user = await this.userRepo.findByUsername(username);
            if (!user) {
                res.status(401).json("Invalid credentials");
            } else {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    res.status(401).json("Invalid credentials");
                } else {
                    const token = sign({ username: user.username, isAdmin: user.isAdmin }, Config.secretKey);
                    res.status(200).json({ token });
                }
            }
        }else{
            res.status(400).json("Body is not formated properly");
        }
    }
}
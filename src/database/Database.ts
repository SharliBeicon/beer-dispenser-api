import mongoose, {Connection} from "mongoose";
import config from "../config/Config";

export default class Database {
    private static instance: Database;
    private connection: Connection;
    private dbUri: string = config.dbUri;
    
    private constructor(){
        mongoose.set('strictQuery', true);
        this.connection = mongoose.connection;
        
        try{
            console.log(`Connecting to: ${this.dbUri}`);
            mongoose.connect(this.dbUri);
            console.log('Connected to DB');
        } catch (e){
            console.log('Error connecting to DB');
        }
    }
    
    public static getInstance(): Database {
        if(!this.instance){
            this.instance = new Database();
        }
        return this.instance;
    }
}
import mongoose, {Schema} from 'mongoose'
import { MongoDBRepository, BaseModel } from './Base';

export interface UserModel extends BaseModel {
    username: string,
    password: string,
    isAdmin: boolean
}

const userSchema = new Schema<UserModel>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true}
});

export default class UserRepo extends MongoDBRepository<UserModel>{
    constructor(){
        const userModel = mongoose.model<UserModel>('User', userSchema);
        super(userModel);
    }

    async findByUsername(username: string): Promise<UserModel | null>{
        return this.model.findOne({ username }).exec();
    }   
}

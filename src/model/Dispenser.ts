import mongoose, {Schema} from 'mongoose'
import { MongoDBRepository, BaseModel } from './Base';

export type dispenserState = "open" | "close" | "unknown";

interface DispenserSpending{
    opened_at?: Date,
    closed_at?: Date,
    flow_volume: number,
    total_spent?: number
}

export interface DispenserSpendingLine extends BaseModel {
    dispenserSpendingLine: DispenserSpending[]
}

const dispenserSpendingSchema = new Schema<DispenserSpending>({
    opened_at: {type: Date, default: null},
    closed_at: {type: Date, default: null},
    flow_volume: {type: Number, required: true},
    total_spent: {type: Number, default: 0}
});

const dispenserSpendingLineSchema = new Schema({
    dispenserSpendingLine: {type: [dispenserSpendingSchema]}
});

export default class DispenserRepo extends MongoDBRepository<DispenserSpendingLine>{
    constructor(){
        const dispenserModel = mongoose.model<DispenserSpendingLine>('Dispenser', dispenserSpendingLineSchema);
        super(dispenserModel)
    }

    async findByIdParsed(id: string): Promise<DispenserSpendingLine | null>{
        return this.model.findById(id, {_id: 0, __v: 0, "dispenserSpendingLine._id":0}).exec();
    }
}
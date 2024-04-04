import mongoose, {Document,  Model, Schema} from 'mongoose';

export interface BaseModel extends Document {
    createdAt: Date;
    updatedAt: Date;
}

const BaseSchema = new Schema(
    {
        createdAt:{ type: Date, default: Date.now},
        updatedAt:{ type: Date, default: Date.now},
    },
    {_id: true}
)

const Base = mongoose.model<BaseModel>('Base', BaseSchema);

export class MongoDBRepository<T extends BaseModel> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model=model;
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async findById(id: string): Promise<T | null>{
        return this.model.findById(id).exec();
    }

    async update(id: string, data: Partial<T>): Promise <T | null>{
        return this.model.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    async delete(id: string): Promise<void> {
        await this.model.findByIdAndRemove(id).exec();
    }
}
import { Schema, model } from 'mongoose';


interface Address {
    userId: String
    state: String;
    city: String;
    lat: String;
    long: String;
    isPrimary: boolean;
    isActive: boolean;
    isDelete: boolean;


}

const schema = new Schema<Address>({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    state: { type: String ,require:true},
    city: { type: String ,required:true },
    lat: { type: String,required:true },
    long: { type: String ,required:true},
    isPrimary: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});


const addressModel = model<Address>('address', schema);
export = addressModel
